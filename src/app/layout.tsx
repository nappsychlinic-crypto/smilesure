import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "SmileSure Dental Care | Dentist in Sector 120, Noida",
    template: "%s | SmileSure Dental Care",
  },
  description:
    "SmileSure Dental Care offers gentle, ethical dental care for families in Sector 120, Noida. Book an appointment with Dr. Shrestha Singh, Consultant Orthodontist.",
  keywords: [
    "dentist in noida",
    "dental clinic sector 120",
    "orthodontist noida",
    "root canal treatment",
    "teeth whitening noida",
    "painless dentistry",
    "family dentist noida",
  ],
  authors: [{ name: "Dr. Shrestha Singh" }],
  openGraph: {
    title: "SmileSure Dental Care | Best Dentist in Sector 120, Noida",
    description:
      "Gentle, Ethical Dental Care for You and Your Family. Book an appointment today!",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
