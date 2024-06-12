"use client";

import * as pdfjs from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { H2 } from "@/components/Typography/H2";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

// TODO 画像でもOCRをする

const convertPDFToBase64Images = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    cMapUrl: "/cmaps/",
    cMapPacked: true,
  });
  const pdf = await loadingTask.promise;

  const base64ImageList: string[] = [];
  const canvas = document.createElement("canvas");

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 3 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = canvas.getContext("2d");
    if (!renderContext) {
      return [];
    }
    const renderTask = page.render({
      canvasContext: renderContext,
      viewport,
    });
    await renderTask.promise;

    const base64Image = canvas.toDataURL("image/jpeg");
    base64ImageList.push(base64Image.split(",")[1]);
  }

  return base64ImageList;
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

      try {
        // PDFを画像にする
        setBase64ImageList(await convertPDFToBase64Images(file));
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
      const timestamp = new Date().toISOString();
      const fileName = `${timestamp}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("ocr_results")
        .upload(fileName, file, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.error("Error uploading image");
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      console.log("All images uploaded successfully");
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

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc =
      window.location.origin + "/pdf.worker.min.mjs";
  }, []);

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

      {base64ImageList.length > 0 && (
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
      )}
    </div>
  );
};
