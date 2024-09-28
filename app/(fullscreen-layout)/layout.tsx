import { Navbar } from "@/src/common/ui/navbar/components/navbar";

/**
 * Layout for pages that have a fixed size that is equal to the width and height
 * of the browser screen. The main body does not have scroll in these pages.
 */
export default function FullscreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col">
      <Navbar />
      <main className="relative min-h-0 flex-1">{children}</main>
    </div>
  );
}
