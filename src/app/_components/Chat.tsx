"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChatRequestSchema,
  SupplementaryCodeFormSchema,
} from "@/server/type/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassAttributes, HTMLAttributes, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { CustomTextarea } from "./CustomTextarea";
import { Card, CardContent } from "@/components/ui/card";

type CustomCodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> &
  ExtraProps;

const CustomCode = ({ className, children }: CustomCodeProps) => {
  const match = /language-(\w+)/.exec(className || "");

  // インラインコードの表示
  if (!className && typeof children === "string" && !children.includes("\n")) {
    return (
      <code className="bg-gray-800 text-white px-1 mx-1 rounded">
        {children}
      </code>
    );
  }

  return match ? (
    // 言語指定のあるcode block
    <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="pre">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    // 言語指定なしのcode block
    <SyntaxHighlighter style={atomDark} PreTag="pre">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

const SupplementaryCodeFormDialog = () => {
  const form = useForm<z.infer<typeof SupplementaryCodeFormSchema>>({
    resolver: zodResolver(SupplementaryCodeFormSchema),
    defaultValues: {
      supplementaryCode: [
        {
          codeDescription: "",
          code: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "supplementaryCode",
  });

  const onSubmit = async (
    data: z.infer<typeof SupplementaryCodeFormSchema>,
  ) => {
    console.log("submit!!!!");
    console.log(data);

    // TODO APIを叩く
    const res = await fetch("/api/supplementary-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("error");
      return;
    }

    // TODO LoadingUI

    // 成功したらダイアログを閉じる
    form.reset();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="mr-2">
          関連ファイルの追加
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>関連ファイル</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, idx) => (
              <div key={field.id} className="space-y-4">
                <div>
                  <label htmlFor={`supplementaryCode[${idx}].codeDescription`}>
                    コードの概要
                  </label>
                  <CustomTextarea
                    name={`supplementaryCode[${idx}].codeDescription`}
                    placeholder="コードの目的や概要を入力してください"
                    setValue={(value) => {
                      form.setValue(
                        `supplementaryCode.${idx}.codeDescription`,
                        value,
                      );
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`supplementaryCode[${idx}].code`}>
                    コード
                  </label>
                  <CustomTextarea
                    name={`supplementaryCode[${idx}].code`}
                    placeholder="conosle.log('Hello, World!');"
                    setValue={(value) => {
                      form.setValue(`supplementaryCode.${idx}.code`, value);
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => remove(idx)}
                >
                  削除
                </Button>
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={() => append({ codeDescription: "", code: "" })}
              >
                追加
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type History = {
  role: string;
  text: string;
};

const ChatHistory = ({ histories }: { histories: History[] }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {histories.map((message, idx) => (
        <Card key={idx} className="my-4 py-2">
          <CardContent>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CustomCode,
              }}
            >
              {message.text}
            </ReactMarkdown>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const Chat = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [histories, setHistories] = useState<History[]>([]);

  const form = useForm<z.infer<typeof ChatRequestSchema>>({
    resolver: zodResolver(ChatRequestSchema),
    defaultValues: {
      codeDescription: "",
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ChatRequestSchema>) => {
    setIsDisabled(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const json = await res.json();

    setHistories((prevHistories) => [
      ...prevHistories,
      {
        role: "user",
        text: data.codeDescription + "\n```\n" + data.code + "\n```\n",
      },
      { role: "model", text: json.response },
    ]);

    setIsDisabled(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 overflow-y-auto">
        <ChatHistory histories={histories} />
      </div>
      <div className="w-1/2 flex flex-col pt-4">
        <div className="flex justify-end p-4">
          <SupplementaryCodeFormDialog />
          <Button
            form="prompt"
            type="submit"
            variant="secondary"
            disabled={isDisabled}
          >
            送信
          </Button>
        </div>
        <Form {...form}>
          <form
            id="prompt"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4"
          >
            <FormField
              control={form.control}
              name="codeDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="codeDescription">コードの概要</FormLabel>
                  <FormControl>
                    <CustomTextarea
                      name="codeDescription"
                      placeholder="コードの目的や概要を入力してください"
                      setValue={(value) => {
                        form.setValue("codeDescription", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="code">コード</FormLabel>
                  <FormControl>
                    <CustomTextarea
                      name={"code"}
                      placeholder="conosle.log('Hello, World!');"
                      setValue={(value) => {
                        form.setValue("code", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};
