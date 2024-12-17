export const getServerSideConfig = () => {
    return {
      apiModel: "gemini",
      apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: process.env.GOOGLE_API_KEY || "",
    };
  };