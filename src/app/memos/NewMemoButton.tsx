"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newMemo } from "@/server/actions/newMemo";

export const NewMemoButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Memo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タイトルを入力して下さい</DialogTitle>
        </DialogHeader>
        <form action={newMemo}>
          <Input id="title" name="title" className="mb-4" required />
          <div className="flex justify-end">
            <Button type="submit" className="w-1/4">
              作成
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
