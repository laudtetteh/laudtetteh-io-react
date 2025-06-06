/**
 * Resolves the base URL for API requests.
 *
 * On server:
 *   - Use internal Docker URL (http://api:8000)
 * On client:
 *   - Use public-facing URL (http://localhost:8000)
 */
export const API_BASE_URL = typeof window === 'undefined'
  ? process.env.API_SERVER || 'http://api:8000' // Used only server-side (getStaticProps, getServerSideProps)
  : process.env.NEXT_PUBLIC_API_BROWSER || 'http://localhost:8000'; // Used in browser
