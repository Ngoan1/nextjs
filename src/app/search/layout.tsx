import AppFooter from "@/components/Footer/app.footer";
import AppHeader from "@/components/Header/app.header";
import Script from "next/script";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
            <AppHeader></AppHeader>
            {children}
            <div style={{marginBottom:100}}></div>
            <AppFooter></AppFooter>
      </body>
    </html>
  );
}
