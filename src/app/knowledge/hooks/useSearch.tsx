import { searchAndFormat } from "@/server/actions/searchAndFormat";
import { useState } from "react";

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const searchQuery = formData.get("search-text") as string;

    const formattedResults = await searchAndFormat(searchQuery);
    setSearchResults(formattedResults.map((r) => r.content).join("\n\n"));
  };

  return {
    searchResults,
    handleSubmit,
  };
};
