import { useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import { savePdfTextContents } from "@/server/actions/book";

export type PdfTextContent = {
  pageNumber: number;
  text: string;
};

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const usePdfToText = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfTextContents, setPdfTextContents] = useState<PdfTextContent[]>([]);

  const onClickUploadPDF = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const pdfToText = async (file: File) => {
    let pdfTextContents: PdfTextContent[] = [];

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
    });
    const pdf = await loadingTask.promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join("");

      pdfTextContents = [
        ...pdfTextContents,
        {
          pageNumber: i,
          text: pageText,
        },
      ];
    }

    return pdfTextContents;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);

      try {
        const pdfTextContents = await pdfToText(file);
        setPdfTextContents(pdfTextContents);

        await savePdfTextContents({
          bookName: file.name,
          pdfTextContents,
        });
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    pdfTextContents,
    fileInputRef,
    isLoading,
    onClickUploadPDF,
    handleFileUpload,
  };
};
