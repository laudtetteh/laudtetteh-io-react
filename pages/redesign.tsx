import type { GetServerSideProps, NextPage } from 'next';

/**
 * `/redesign` was the side-by-side preview route for the new design while it
 * was being built (Sprint 1). The cutover (#17) made the same `RedesignLayout`
 * live at `/` instead. Kept as a thin redirect — rather than deleted outright —
 * for a short verification window: any bookmarks, in-flight links, or search
 * index entries pointing at `/redesign` still land on working content, and the
 * redirect is trivially reversible if the cutover needs to be rolled back.
 * Safe to delete once `/` has been confirmed stable in production (tracked
 * alongside the rest of the legacy-template cleanup, #20).
 */
const RedesignRedirect: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default RedesignRedirect;
