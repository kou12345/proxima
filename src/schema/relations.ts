import { relations } from "drizzle-orm/relations";
import { memos, memoContents, books, pages } from "./schema";

export const memoContentsRelations = relations(memoContents, ({one}) => ({
	memo: one(memos, {
		fields: [memoContents.memoId],
		references: [memos.id]
	}),
}));

export const memosRelations = relations(memos, ({many}) => ({
	memoContents: many(memoContents),
}));

export const pagesRelations = relations(pages, ({one}) => ({
	book: one(books, {
		fields: [pages.bookId],
		references: [books.id]
	}),
}));

export const booksRelations = relations(books, ({many}) => ({
	pages: many(pages),
}));