import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type Props = {
  content: string;
};

export const PostCard = ({ content }: Props) => {
  return (
    <Card className="my-4 w-full">
      <CardContent className="p-4">
        <Markdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            p: ({ children }) => (
              <p style={{ marginBottom: "1em" }}>{children}</p>
            ),
          }}
          className="markdown"
        >
          {content}
        </Markdown>
      </CardContent>
    </Card>
  );
};
