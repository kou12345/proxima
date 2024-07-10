import { Button } from "@/components/ui/button";
import { ChangeEvent, FunctionComponent, RefObject } from "react";

export const UploadPDFButton: FunctionComponent<{
  isLoading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onClickUploadPDF: () => Promise<void>;
}> = ({ isLoading, fileInputRef, handleFileUpload, onClickUploadPDF }) => {
  return (
    <>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <Button
        onClick={onClickUploadPDF}
        className="mx-2 mb-4"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Upload PDF"}
      </Button>
    </>
  );
};
