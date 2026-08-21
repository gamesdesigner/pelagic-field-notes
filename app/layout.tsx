import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pelagic Field Notes · Life Between Light & Darkness",
  description: "An interactive ocean biology field lesson from the sunlit surface to the midnight zone.",
  openGraph: {
    title: "Pelagic Field Notes · Life Between Light & Darkness",
    description: "An interactive ocean biology field lesson from the sunlit surface to the midnight zone.",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Pelagic Field Notes — Life Between Light & Darkness" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pelagic Field Notes · Life Between Light & Darkness",
    description: "An interactive ocean biology field lesson from the sunlit surface to the midnight zone.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
