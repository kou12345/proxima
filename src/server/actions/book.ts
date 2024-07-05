"use server";

import { PdfTextContent } from "@/app/knowledge/usePdfToText";
import "server-only";
import { db } from "../db";
import { books, pages } from "@/schema/schema";
import { revalidatePath } from "next/cache";

// TODO 認証チェック

export const savePdfTextContents = async ({ bookName, pdfTextContents }: {
  bookName: string;
  pdfTextContents: PdfTextContent[];
}) => {
  const insertBookRes = await db.insert(books).values({
    title: bookName,
  }).returning({
    id: books.id,
  });

  const bookId = insertBookRes[0].id;

  // pagesにinsertするvaluesを作成する
  const pagesValue = pdfTextContents.map((pdfTextContent) => ({
    bookId,
    content: pdfTextContent.text,
    pageNumber: pdfTextContent.pageNumber,
  }));

  console.log("pagesValue: ", pagesValue);

  await db.insert(pages).values(pagesValue);

  revalidatePath("/knowledge");
};

export const getBooks = async () => {
  const booksRes = await db.select({
    id: books.id,
    title: books.title,
  }).from(books);

  return booksRes;
};
