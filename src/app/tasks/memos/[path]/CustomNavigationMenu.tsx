"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { extractTaskResponseSchema } from "@/server/type/tasks/zodSchema";
import { getLastPathSegment } from "@/utils/pathname";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ExtractTaskDialog = () => {
  const [extractedText, setExtractedText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const lastPathSegment = decodeURIComponent(getLastPathSegment(usePathname()));

  const handleExtractTask = async () => {
    const res = await fetch("/api/extract-task", {
      method: "POST",
      body: JSON.stringify({ path: lastPathSegment }),
    });

    if (!res.ok) {
      setExtractedText("Failed to extract task");
      return;
    }

    const data = await res.json();
    const parsedData = extractTaskResponseSchema.safeParse(data);
    if (!parsedData.success) {
      setExtractedText("Failed to extract task");
      return;
    }

    setExtractedText(parsedData.data.text);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          handleExtractTask();
        }
      }}
    >
      <DialogTrigger>Extract task</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{lastPathSegment}</DialogTitle>
        </DialogHeader>
        {extractedText}
      </DialogContent>
    </Dialog>
  );
};

export const CustomNavigationMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ExtractTaskDialog />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
