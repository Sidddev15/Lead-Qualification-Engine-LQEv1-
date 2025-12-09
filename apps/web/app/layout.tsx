import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "LQE v1",
  description: "Lead Qualification Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <Providers>
          <div className="max-w-5xl mx-auto py-8 px-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
