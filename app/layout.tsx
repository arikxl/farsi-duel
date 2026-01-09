import type { Metadata } from "next";
import "./globals.css";
import { Heebo } from "next/font/google"; 
// import { Rubik } from "next/font/google"; 


const heebo = Heebo({ subsets: ["hebrew"] });

// const rubik = Rubik({
//   subsets: ["hebrew", "latin"], // חשוב מאוד! טוען את התווים בעברית
//   weight: ["300", "400", "500", "700", "900"], // טוען את כל המשקלים (דק עד שמן מאוד)
//   variable: "--font-rubik",
// });

export const metadata: Metadata = {
  title: "BOOM ראש בראש",
  description: "תחרות אוצר מילים בין באר שבע לאילת",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.className} bg-gray-900`}>
        <div className="min-h-screen flex justify-center bg-gray-900 sm:py-0">
          <main className="w-full max-w-100 min-h-screen bg-white shadow-2xl relative overflow-hidden flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
