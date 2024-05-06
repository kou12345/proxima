import { Octokit, RequestError } from "octokit";

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
    console.log(res);

    console.log(res.data.tree);
    return res.data.tree;
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
