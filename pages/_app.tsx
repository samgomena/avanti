import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import Layout from "../components/Layout";
import "../styles/scss/theme.scss";

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  return (
    <Suspense>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </Suspense>
  );
}
