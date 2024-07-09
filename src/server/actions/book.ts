"use server";

import "server-only";
import { db } from "../db";
import { books, pages } from "@/schema/schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { generateEmbeddings } from "./embedding";
import { PdfTextContent } from "@/app/knowledge/hooks/usePdfToText";

// TODO すでに同じ本が登録されている場合の処理を追加する

export const savePdfTextContents = async ({ bookName, pdfTextContents }: {
  bookName: string;
  pdfTextContents: PdfTextContent[];
}) => {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }

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

  const insertedPageRes = await db.insert(pages).values(pagesValue).returning({
    id: pages.id,
    content: pages.content,
  });

  // TODO ここでembeddingを実行する
  await generateEmbeddings(insertedPageRes);

  revalidatePath("/knowledge");
};

export const getBooks = async () => {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const booksRes = await db.select({
    id: books.id,
    title: books.title,
  }).from(books);

  return booksRes;
};
