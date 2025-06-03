export const API_BASE_URL =
  process.env.NEXT_PUBLIC_IS_DOCKER === "true"
    ? process.env.NEXT_PUBLIC_API_DOCKER
    : process.env.NEXT_PUBLIC_API_LOCAL;
