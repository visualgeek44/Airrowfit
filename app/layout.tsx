import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airrowfit | Architectural Metal Solutions",
  description: "Premier provider of Architectural Metal Solutions with 10+ years of excellence across South India's landmark infrastructure and commercial projects.",
  keywords: "architectural metal solutions, metal cladding, structural steel, South India, Kerala, Lulu Mall, Cochin Airport",
  openGraph: {
    title: "Airrowfit | Architectural Metal Solutions",
    description: "Premier provider of Architectural Metal Solutions with 10+ years of excellence.",
    type: "website",
    url: "https://airrowfit.com",
  },
  icons: {
    icon: "/images/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
