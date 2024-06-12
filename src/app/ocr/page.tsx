"use client";

import { H1 } from "@/components/Typography/H1";
import dynamic from "next/dynamic";

// Note: pdfjs-dist is not compatible with SSR
const ConvertPDFToImageWithNoSSR = dynamic(
  () =>
    import("./ConvertPDFToImage").then((module) => module.ConvertPDFToImage),
  { ssr: false },
);

export default function OCRPage() {
  return (
    <div>
      <H1>OCR</H1>

      <ConvertPDFToImageWithNoSSR />
    </div>
  );
}
