import type { AppType } from "next/app";
import { Suspense } from "react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import "@/styles/scss/theme.scss";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <Suspense>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Suspense>
  );
};

export default api.withTRPC(App);
