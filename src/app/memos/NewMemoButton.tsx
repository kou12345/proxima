"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const NewMemoButton = () => {
  const router = useRouter();
  const onClickNewMemo = async () => {
    router.push("/memos/new");
  };

  return <Button onClick={onClickNewMemo}>new memo</Button>;
};
