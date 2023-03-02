import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Suspense } from "react";
import SSRProvider from "react-bootstrap/SSRProvider";
import Layout from "../components/Layout";
import "../styles/scss/theme.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense>
      <SSRProvider>
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </SSRProvider>
    </Suspense>
  );
}
