interface ServerConfig {
  apiModel: string;
  apiEndpoint: string;
  apiKey: string;
}

export const getServerSideConfig = (): ServerConfig => {
  return {
    apiModel: "gemini",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: process.env.GOOGLE_API_KEY || "",
  };
};