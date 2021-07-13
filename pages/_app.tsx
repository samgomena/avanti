import { AppProps } from "next/app";
import "../styles/scss/theme.scss";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
