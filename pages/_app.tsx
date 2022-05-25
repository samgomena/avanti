import { AppProps } from "next/app";
import { Suspense } from "react";
import SSRProvider from "react-bootstrap/SSRProvider";
import Layout from "../components/Layout";
import "../styles/scss/theme.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense>
      <SSRProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SSRProvider>
    </Suspense>
  );
}
