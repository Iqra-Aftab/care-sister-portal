import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  title: "Care Tracker — I am here with you",
  description:
    "A private, judgment-free pocket companion for your menstrual health — no app store, no download, no shame.",
};

export default function RootLayout({ children }) {
  // Read the Comfort Dial preferences set client-side so returning visitors
  // (even signed-out ones) never see a flash of the default tint/density.
  const cookieStore = cookies();
  const tint = cookieStore.get("ct_tint")?.value || "sand";
  const density = cookieStore.get("ct_density")?.value || "comfortable";

  return (
    <html
      lang="en"
      data-tint={tint}
      data-density={density}
      className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
