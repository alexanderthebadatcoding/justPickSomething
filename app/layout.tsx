import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Just Pick Something",
  description:
    "Get movie recommendations so you can stop scrolling endlessly through titles, wondering if 'that one' is worth your time—let us help you pick a film that won’t have you questioning your life choices!",
  openGraph: {
    title: "Just Pick Something",
    description:
      "Get movie recommendations so you can stop scrolling endlessly through titles, wondering if 'that one' is worth your time—let us help you pick a film that won’t have you questioning your life choices!",
    // url: "https://",
    images: [
      {
        url: "/og-image.jpg", // OG image for social sharing
        width: 1200,
        height: 630,
        alt: "TV Dice Pizza and movie clappers",
      },
    ],
    siteName: "Just Pick Something",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        {children}
      </body>
    </html>
  );
}
