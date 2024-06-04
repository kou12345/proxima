import { ConvertPDFToImage } from "./ConvertPDFToImage";

export default async function OCRPage() {
  return (
    <div>
      <h1>OCR</h1>

      <ConvertPDFToImage />
    </div>
  );
}
