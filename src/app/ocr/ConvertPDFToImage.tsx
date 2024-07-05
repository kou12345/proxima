"use client";

import * as pdfjs from "pdfjs-dist";
import { useRef, useState } from "react";
import { H2 } from "@/components/Typography/H2";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { saveMetadataToOcrResults } from "@/server/actions/ocrResults";

// TODO 画像でもOCRをする

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const convertPDFToBase64Images = async (file: File) => {
  // pdfのテキスト
  let pdfText = "";

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
  });
  const pdf = await loadingTask.promise;

  const base64ImageList: string[] = [];
  // const canvas = document.createElement("canvas");

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join("");
    pdfText += pageText;

    // const viewport = page.getViewport({ scale: 3 });
    // canvas.height = viewport.height;
    // canvas.width = viewport.width;
    // const renderContext = canvas.getContext("2d");
    // if (!renderContext) {
    //   throw new Error("Failed to get canvas context");
    // }
    // const renderTask = page.render({
    //   canvasContext: renderContext,
    //   viewport,
    // });
    // await renderTask.promise;

    // const base64Image = canvas.toDataURL("image/jpeg");
    // base64ImageList.push(base64Image.split(",")[1]);
  }

  return {
    base64ImageList,
    pdfText,
  };
};

const convertBase64ImagesToFiles = (base64ImageList: string[]) => {
  const fileList: File[] = [];

  for (let i = 0; i < base64ImageList.length; i++) {
    const base64Image = base64ImageList[i];
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let j = 0; j < byteCharacters.length; j++) {
      byteNumbers[j] = byteCharacters.charCodeAt(j);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const file = new File([blob], `image_${i}.jpg`, { type: "image/jpeg" });
    fileList.push(file);
  }

  return fileList;
};

export const ConvertPDFToImage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [base64ImageList, setBase64ImageList] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const [pdfText, setPdfText] = useState<string>("");

  const onClickUploadPDF = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setFolderName(new Date().toISOString());
      setFileName(file.name);

      try {
        // PDFを画像にする
        // setBase64ImageList(await convertPDFToBase64Images(file));
        const { base64ImageList, pdfText } =
          await convertPDFToBase64Images(file);
        setBase64ImageList(base64ImageList);

        setPdfText(pdfText);
      } catch (error) {
        console.error("Error converting PDF to images");
      }

      setIsLoading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onClickSave = async () => {
    setSaveLoading(true);
    const supabase = createClient();

    const files = convertBase64ImagesToFiles(base64ImageList);

    const uploadPromises = files.map(async (file) => {
      const { error } = await supabase.storage
        .from("ocr_results")
        .upload(
          `${folderName}/${new Date().toISOString()}_${file.name}`,
          file,
          {
            contentType: "image/jpeg",
          },
        );

      if (error) {
        console.error("Error uploading image");
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      console.log("All images uploaded successfully");

      // fileNameとpdfから取得したfileNameをDBに保存する
      await saveMetadataToOcrResults({
        fileName,
        storagePath: folderName,
      });
    } catch (error) {
      console.error("Error uploading images:");
    } finally {
      setSaveLoading(false);
    }
  };

  const onCLickOCR = async () => {
    const res = await fetch("api/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64ImageList[0],
      }),
    });

    if (!res.ok) {
      console.error("Failed to OCR:", res.statusText);
      return;
    }

    const json = await res.json();
    console.log(json);
  };

  return (
    <div>
      <H2>Convert PDF to Image</H2>

      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <div className="flex items-center justify-end">
        <div className="flex py-2">
          <Button
            onClick={onClickUploadPDF}
            className="mx-2"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Upload PDF"}
          </Button>

          <Button
            className="mx-2"
            disabled={base64ImageList.length === 0}
            onClick={onClickSave}
          >
            {saveLoading ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={onCLickOCR}
            className="mx-2"
            disabled={base64ImageList.length === 0}
          >
            OCR
          </Button>
        </div>
      </div>

      {pdfText && (
        <div className="py-2">
          <p>{pdfText}</p>
        </div>
      )}
      {/* {base64ImageList.length > 0 && (
        <div className="image-list py-2">
          {base64ImageList.map((base64Image, index) => (
            <Image
              key={index}
              src={`data:image/jpeg;base64,${base64Image}`}
              alt={`Page ${index + 1}`}
              width={500}
              height={500}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};
