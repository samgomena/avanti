import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ParallaxProvider } from "react-scroll-parallax";
import { Toaster } from "sonner";

export const siteTitle = "Avanti - Restaurant & Bar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ParallaxProvider>
      <div>
        <Head>
          {/* HTML Meta Tags */}
          <title>{siteTitle}</title>
          <meta
            name="description"
            content="We're a small family-owned restaurant located just off of I-205 at the 10th street exit in West Linn, Oregon."
          />

          {/* Facebook Meta Tags */}
          <meta property="og:url" content="https://avantiwestlinn.com/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={siteTitle} />
          <meta
            property="og:description"
            content="We're a small family-owned restaurant located just off of I-205 at the 10th street exit in West Linn, Oregon."
          />
          <meta property="og:image" content="/assets/photos/og-image.png" />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="avantiwestlinn.com" />
          <meta property="twitter:url" content="https://avantiwestlinn.com/" />
          <meta name="twitter:title" content={siteTitle} />
          <meta
            name="twitter:description"
            content="We're a small family-owned restaurant located just off of I-205 at the 10th street exit in West Linn, Oregon."
          />
          <meta
            name="twitter:image"
            content="https://avantiwestlinn.com/api/og-image"
          />

          {/* Favicon stuff */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <Navbar />
        {children}
      </div>
      {/* Offset layout so it shows up below nav bar */}
      <Toaster position="top-center" richColors offset="100px" />
      <Footer />
    </ParallaxProvider>
  );
};

export default Layout;
