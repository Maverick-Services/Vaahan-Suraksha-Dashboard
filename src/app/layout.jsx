import { Inter } from "next/font/google";
import "./globals.css";
import MainLayoutProvider from "@/components/dashboard/MainLayoutProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: "VS Dashboard",
  description: "Vaahan Suraksha Dashboard",
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayoutProvider>
          {children}
        </MainLayoutProvider>
      </body>
    </html>
  );
}
