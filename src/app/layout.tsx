import ThemeRegistry from "@/components/theme-registry/theme.registry";
import { TrackContextProvider } from "@/lib/context/track.contect";
import NextAuthProvider from "@/lib/next.auth.provider";
import NProgressBar from "@/lib/progess/progess";
import { ToastProvider } from "@/lib/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NProgressBar>
            <NextAuthProvider>
              <ToastProvider>
                <TrackContextProvider>{children}</TrackContextProvider>
              </ToastProvider>
            </NextAuthProvider>
          </NProgressBar>
        </ThemeRegistry>
      </body>
    </html>
  );
}
