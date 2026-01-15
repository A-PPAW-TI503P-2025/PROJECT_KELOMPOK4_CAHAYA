#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>

// --------------------------------------------------------------------------
// CONFIGURATION
// --------------------------------------------------------------------------
const char *ssid = "mosu";
const char *password = "buka24jam";
const char *serverUrl =
    "http://192.168.76.196:3000/api/device"; // Change IP to your laptop's IP

// PINS
const int LDR_PIN = 34;   // Analog input pin for LDR
const int LED_PIN = 2;    // Internal LED (or connected relay)
const int BUTTON_PIN = 0; // Optional: Boot button for manual toggle

// VARIABLES
int threshold = 2000;
bool manualMode = false;
bool manualLampStatus = false;
bool currentLampStatus = false;
unsigned long lastTime = 0;
unsigned long timerDelay = 2000; // Send data every 2 seconds

void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(LDR_PIN, INPUT);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Send an HTTP POST request every timerDelay
  if ((millis() - lastTime) > timerDelay) {
    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {

      // 1. GET CONFIGURATION
      fetchConfig();

      // 2. READ SENSOR
      int lightValue = analogRead(LDR_PIN);
      // Invert if necessary (depends on LDR circuit), usually higher = brighter
      // or darker Assuming 0-4095. Let's assume higher = brighter. Adjust logic
      // based on your hardware. Example: If < threshold (dark) -> Turn ON

      // 3. DETERMINE ACTUATOR STATE
      if (!manualMode) {
        // AUTOMATIC LOGIC
        if (lightValue > threshold) {
          currentLampStatus = true; // Dark -> Light ON
        } else {
          currentLampStatus = false; // Bright -> Light OFF
        }
        Serial.printf("[AUTO] Light: %d < Threshold: %d -> Lamp: %s\n",
                      lightValue, threshold, currentLampStatus ? "ON" : "OFF");
      } else {
        // MANUAL MODE
        currentLampStatus = manualLampStatus;
        Serial.printf("[MANUAL] Force Lamp: %s\n",
                      currentLampStatus ? "ON" : "OFF");
      }

      // Hardware Actuation (Note: ESP32 built-in LED is active-LOW)
      // LOW = LED ON, HIGH = LED OFF
      digitalWrite(LED_PIN, currentLampStatus ? LOW : HIGH);

      // 4. SEND LOGS TO BACKEND
      postSensorData(lightValue, currentLampStatus);

    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

void fetchConfig() {
  HTTPClient http;
  String url = String(serverUrl) + "/config";
  http.begin(url.c_str());

  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String payload = http.getString();
    // Serial.println(payload); // Debug

    // Parse JSON
    // Response: {"meta":{...}, "data":{"threshold":2000,"manualMode":false}}
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      if (doc["data"]["threshold"]) {
        threshold = doc["data"]["threshold"].as<int>();
      }
      if (doc["data"].containsKey("manualMode")) {
        manualMode = doc["data"]["manualMode"].as<bool>();
      }
      if (doc["data"].containsKey("lampStatus")) {
        manualLampStatus = doc["data"]["lampStatus"].as<bool>();
      }
      Serial.printf("Config -> Threshold: %d, Manual: %s, ManualLamp: %s\n",
                    threshold, manualMode ? "TRUE" : "FALSE",
                    manualLampStatus ? "ON" : "OFF");
    } else {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
    }
  } else {
    Serial.print("Error fetching config. HTTP Response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void postSensorData(int lightValue, bool lampStatus) {
  HTTPClient http;
  String url = String(serverUrl) + "/log";
  http.begin(url.c_str());
  http.addHeader("Content-Type", "application/json");

  // JSON Body: {"lightValue": 123, "lampStatus": true}
  String jsonBody = "{\"lightValue\":" + String(lightValue) +
                    ",\"lampStatus\":" + (lampStatus ? "true" : "false") + "}";

  int httpResponseCode = http.POST(jsonBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Data Posted. Response: " +
                   String(httpResponseCode)); // + " " + response);
  } else {
    Serial.print("Error sending POST: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
