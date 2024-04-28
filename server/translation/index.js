import { pipeline } from "@xenova/transformers";

// 日本語を英語に翻訳する関数を定義する
export const translation = async (text) => {
  const translator = await pipeline(
    "translation",
    "Xenova/nllb-200-distilled-600M",
  );
  const output = await translator(text, {
    src_lang: "jpn_Jpan",
    tgt_lang: "eng_Latn",
  });

  return output;
};
