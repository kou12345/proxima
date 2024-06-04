"use client";

import { Button } from "@/components/ui/button";
import { createMemo } from "@/server/actions/memo";
import { useState } from "react";

export const NewMemoButton = () => {
  // TODO Buttonを押したら、ボタンにローディングアイコンを表示する
  const [isLoaded, setIsLoaded] = useState(false);
  const onClickNewMemo = async () => {
    setIsLoaded(true);
    await createMemo();
    setIsLoaded(false);
  };

  return (
    <Button onClick={onClickNewMemo} disabled={isLoaded}>
      new memo
    </Button>
  );
};
