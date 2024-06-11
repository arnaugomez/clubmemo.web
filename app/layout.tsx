import { cn } from "@/src/common/ui/utils/shadcn";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";
import { inter } from "../src/common/ui/styles/fonts";
import "./globals.css";

const Toaster = dynamic(() =>
  import("../src/common/ui/components/shadcn/ui/sonner").then(
    (file) => file.Toaster,
  ),
);

export const metadata: Metadata = {
  title: {
    template: "%s | clubmemo",
    default: "clubmemo",
  },
  description:
    "Tu asistente AI para el estudio eficiente. Sube tus apuntes, genera flashards automáticamente y entrena tu memoria con juegos interactivos.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <body className={cn(inter.className, "antialiased")}>
        {children}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
