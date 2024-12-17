import md5 from "spark-md5";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      CODE?: string;
      PROXY_URL?: string;
      VERCEL?: string;
    }
  }
}

interface ServerConfig {
  apiModel: string;
  apiEndpoint: string;
  apiKey: string | undefined;
  code: string | undefined;
  codes: Set<string>;
  needCode: boolean;
  proxyUrl: string | undefined;
  isVercel: boolean;
}

export const getServerSideConfig = (): ServerConfig => {
  return {
    apiModel: "gemini",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: process.env.GOOGLE_API_KEY,
    code: process.env.CODE,
    codes: new Set<string>(process.env.CODE?.split(",")),
    needCode: !!process.env.CODE,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
  };
};
