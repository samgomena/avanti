import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ParallaxProvider } from "react-scroll-parallax";
import React from "react";

export const siteTitle = "Avanti - Restaurant & Bar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
          <title>{siteTitle}</title>
        </Head>
        <Navbar />
        {children}
      </div>
      <Footer />
    </ParallaxProvider>
  );
};

export default Layout;
