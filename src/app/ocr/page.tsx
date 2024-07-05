"use client";

import { H1 } from "@/components/Typography/H1";
import { createClient } from "@/utils/supabase/client";
import { ConvertPDFToImage } from "./ConvertPDFToImage";

export default function OCRPage() {
  const supabase = createClient();

  const folderList = async () => {
    const { data, error } = await supabase.storage
      .from("ocr_results")
      .list("2024-06-18T04:36:03.519Z", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  };

  return (
    <div>
      <H1>OCR</H1>

      <button onClick={folderList}>フォルダ一覧</button>

      <ConvertPDFToImage />
    </div>
  );
}
