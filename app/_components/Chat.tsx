"use client";

import { useState, ClassAttributes, HTMLAttributes } from "react";
import ReactMarkdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChatRequestSchema } from "@/server/type/zodSchema";
import { useBoolean } from "../../hooks/useBoolean";
import { CustomModal } from "./Modal";
import { Button, FormControl, Input, Paper, Stack } from "@mui/material";

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

export const Chat = () => {
  const [codeDescription, setCodeDescription] = useState("");
  const [code, setCode] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  console.log(history);

  const {
    state: isModalOpen,
    setToTrue: openModal,
    setToFalse: closeModal,
  } = useBoolean(false);

  const onSubmitChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDisabled(true);

    const validation = ChatRequestSchema.safeParse({
      codeDescription,
      code,
    });

    if (!validation.success) {
      console.error(validation.error);
      return;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const json = await res.json();

    setHistory((prevHistory) => [
      ...prevHistory,
      {
        role: "user",
        text:
          validation.data.codeDescription +
          "\n```\n" +
          validation.data.code +
          "\n```\n",
      },
      { role: "model", text: json.response },
    ]);

    setCode("");
    setIsDisabled(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        {history.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.role === "user" ? "text-right" : ""}`}
          >
            <span
              className={`${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } p-2 rounded-md inline-block`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CustomCode,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmitChat} className="p-4">
        <Stack spacing={2}>
          <Paper elevation={1} sx={{ padding: "12px" }}>
            <Stack>
              <FormControl required>
                <label htmlFor="codeDescription">コードの概要</label>
                <Input
                  name="codeDescription"
                  defaultValue={codeDescription}
                  aria-label="Input field for code description"
                  multiline
                  placeholder="例: このコードは〇〇を実現するためのコードです。"
                />
              </FormControl>
            </Stack>
            <Stack>
              <FormControl required>
                <label htmlFor="code">コード</label>
                <Input
                  name="code"
                  defaultValue={code}
                  aria-label="Input field for code"
                  multiline
                  placeholder="console.log('Hello, World!');"
                />
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              sx={{
                marginTop: "12px",
              }}
            >
              <Button variant="outlined" onClick={openModal}>
                関連ファイルを追加する
              </Button>
              <Button type="submit" variant="contained" disabled={isDisabled}>
                送信
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </form>
      <CustomModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};
