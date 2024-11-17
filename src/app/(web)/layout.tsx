import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { Poppins } from "next/font/google";
import Header from "@/components/Header/Header";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import Toast from "@/components/Toast/Toast";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Golden Coast",
  description: "Your next adventure awaits!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>

      <body className={poppins.className}>
        <AuthProvider>
          <ThemeProvider>
            <Toast />
            <main className="font-normal">
              <Header />
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
