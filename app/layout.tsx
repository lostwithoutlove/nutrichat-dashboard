import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import { ApolloProvider } from "@/providers/ApolloProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriChat",
  description: "Your AI nutrition companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ApolloProvider>{children}</ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
