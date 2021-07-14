import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";
import { ReactChild } from "react";
import { ParallaxProvider } from "react-scroll-parallax";

export const siteTitle = "Avanti - Restaurant & Bar";

export default function Layout({ children }: { children: ReactChild }) {
  return (
    <ParallaxProvider>
      <div>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content={siteTitle} />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Navbar />
        {children}
      </div>
      <Footer />
    </ParallaxProvider>
  );
}
