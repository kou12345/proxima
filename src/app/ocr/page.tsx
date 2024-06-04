"use client";

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
      <h1>OCR</h1>

      <ConvertPDFToImageWithNoSSR />
    </div>
  );
}
