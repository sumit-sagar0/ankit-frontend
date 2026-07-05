import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./index.css";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Artistic Ankit | Premium Studio Gallery",
  description: "Official physical canvas archive and studio gallery of Artistic Ankit. Hand-crafted original artwork available.",
  openGraph: {
    title: "Artistic Ankit Studio",
    description: "Discover handcrafted physical canvas paintings.",
    url: "https://artisticankit.com",
    siteName: "Artistic Ankit",
    images: [
      {
        url: "https://artisticankit.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Artistic Ankit Studio Gallery",
      }
    ],
    locale: "en_IN",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
