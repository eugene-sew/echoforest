import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EchoForest - AI-Powered Acoustic Monitoring",
  description:
    "An AI-powered system for detecting illegal logging in forest reserves.",
  openGraph: {
    title: "EchoForest",
    description:
      "Detect illegal logging in forest reserves using AI-powered acoustic monitoring.",
    url: "https://yourwebsite.com", // Replace with the actual URL
    type: "website",
    images: [
      {
        url: "/path/to/your/image.jpg", // Replace with the path to your image
        width: 1200,
        height: 630,
        alt: "EchoForest Monitoring System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoForest - AI-Powered Acoustic Monitoring",
    description:
      "An AI-powered system for detecting illegal logging in forest reserves.",
    images: ["/path/to/your/image.jpg"], // Replace with the path to your image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
