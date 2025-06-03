import '../styles/output.css';
import type { AppProps } from "next/app";

// import Layout from "@/components/Layout";        ❌ not created yet
// import { MyAppProvider } from "@/lib/context";   ❌ not created yet

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <MyAppProvider>
    //   <Layout>
        <Component {...pageProps} />
    //   </Layout>
    // </MyAppProvider>
  );
}

export default MyApp;
