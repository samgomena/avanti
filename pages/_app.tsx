import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import { Suspense } from "react";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";
import "@/styles/scss/theme.scss";

const App: AppType<{ session: Session }> = ({ Component, pageProps }) => {
  return (
    <Suspense>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </Suspense>
  );
};

export default api.withTRPC(App);
