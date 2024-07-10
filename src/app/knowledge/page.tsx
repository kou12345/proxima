"use client";

import { usePdfToText } from "./hooks/usePdfToText";
import { Input } from "@/components/ui/input";
import { useSearch } from "./hooks/useSearch";
import { UploadPDFButton } from "./UploadPDFButton";

export default function Page() {
  const { isLoading, fileInputRef, handleFileUpload, onClickUploadPDF } =
    usePdfToText();
  const { searchResults, handleSubmit } = useSearch();

  return (
    <div className=" my-8 flex w-full flex-col items-center">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Search"
          id="search-text"
          name="search-text"
        />
      </form>

      <UploadPDFButton
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        onClickUploadPDF={onClickUploadPDF}
      />

      {searchResults}
    </div>
  );
}
