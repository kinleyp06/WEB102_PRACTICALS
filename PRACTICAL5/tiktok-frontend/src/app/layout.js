import "./globals.css";
import ClientAppShell from "@/components/layout/ClientAppShell";

export const metadata = {
  title: "TikTok Clone",
  description: "Infinite Scroll",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientAppShell>{children}</ClientAppShell>
      </body>
    </html>
  );
}
