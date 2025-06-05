/**
 * Resolves the base URL for API requests.
 *
 * Priority:
 * 1. NEXT_PUBLIC_API_URL (always takes precedence if defined)
 * 2. Docker (if NEXT_PUBLIC_IS_DOCKER === 'true')
 * 3. Local fallback
 */
export const API_BASE_URL = (() => {
  const primary = process.env.NEXT_PUBLIC_API_URL;        // Universal override
  const docker = process.env.NEXT_PUBLIC_API_DOCKER;      // Docker network reference (e.g., http://api:8000)
  const local = process.env.NEXT_PUBLIC_API_LOCAL;        // Localhost dev (e.g., http://localhost:8000)
  const isDocker = process.env.NEXT_PUBLIC_IS_DOCKER === "true";

  const resolved = primary ?? (isDocker ? docker : local);

  if (!resolved) {
    throw new Error(
      "❌ API_BASE_URL could not be resolved. Check your environment variables:\n" +
      "You need to define NEXT_PUBLIC_API_URL, or NEXT_PUBLIC_API_LOCAL / NEXT_PUBLIC_API_DOCKER with NEXT_PUBLIC_IS_DOCKER."
    );
  }

  return resolved;
})();
