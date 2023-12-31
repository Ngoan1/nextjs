'use client'
import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          <SessionProvider>
            {children}
          </SessionProvider>
      </body>
    </html>
  );
}
