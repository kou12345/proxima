"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { post } from "@/server/actions/post";
import React, { FormEvent, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type Props = {
  memoId: string;
};

export const PostForm = ({ memoId }: Props) => {
  const [content, setContent] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    await post(memoId, formData);
    setContent("");
  };

  return (
    <div>
      <Card className="w-full">
        <CardContent className="p-4">
          <form onSubmit={onSubmit}>
            <Tabs defaultValue="markdown" className="w-full">
              <TabsList>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="markdown">
                <Textarea
                  className="h-48 w-full resize-none"
                  id="content"
                  name="content"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="h-48 bg-background">
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
                </div>
              </TabsContent>
            </Tabs>
            <Separator className="my-4" />
            <div className="flex justify-end">
              <Button type="submit">Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
