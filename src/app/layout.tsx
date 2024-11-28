import RootProvider from "@/components/provider";
import './globals.css'
import Navbar from '@/components/navbar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <RootProvider>
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
