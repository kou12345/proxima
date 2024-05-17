import { Octokit, RequestError } from "octokit";
import { ZodError } from "zod";
import { getTreeResponseSchema } from "../type/tasks/zodSchema";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = "kou12345";
const REPO = "Obsidian-Vault";

// GitHubのリポジトリ情報を取得する
export const getRepository = async () => {
  try {
    return await octokit.request("GET /repos/{owner}/{repo}", {
      owner: OWNER,
      repo: REPO,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    if (error instanceof RequestError) {
      console.log(error.message);
      console.log(error.status);
      console.log(error.request);
      console.log(error.response);
    } else {
      throw error;
    }
  }
};

// リポジトリのツリー情報を取得する
export const getTree = async () => {
  try {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1",
      {
        owner: OWNER,
        repo: REPO,
        tree_sha: "main",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    const paresedRes = getTreeResponseSchema.parse(res.data.tree);

    // 削除する名前の配列を定義
    const excludeNames = [".obsidian", ".gitignore"];

    // 削除する名前を含まない要素だけを残す
    const filteredRes = paresedRes.filter(
      (element) => !excludeNames.some((name) => element.path.includes(name)),
    );

    return filteredRes;
  } catch (error) {
    if (error instanceof RequestError) {
      console.log(error.message);
      console.log(error.status);
      console.log(error.request);
      console.log(error.response);
    } else if (error instanceof ZodError) {
      console.log(error.errors);
    } else {
      throw error;
    }
  }
};

export const getContent = async (path: string) => {
  try {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: OWNER,
        repo: REPO,
        path: path,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (Array.isArray(res.data)) {
      throw new Error("res.data is array");
    }

    if (res.data.type !== "file") {
      throw new Error("res.data is not file");
    }

    // base64でエンコードされているファイルの中身をデコードする
    const content = Buffer.from(res.data.content, "base64").toString("utf-8");
    return content;
  } catch (error) {
    if (error instanceof RequestError) {
      console.log(error.message);
      console.log(error.status);
      console.log(error.request);
      console.log(error.response);
    } else {
      throw error;
    }
  }
};
