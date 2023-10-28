import AppFooter from "@/components/Footer/app.footer";
import AppHeader from "@/components/Header/app.header";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import NextAuthProvider from "@/lib/next.auth.provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
