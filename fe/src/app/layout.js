import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: "Smart Lighting System",
  description: "IoT Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen">
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
