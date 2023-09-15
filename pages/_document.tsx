import NextDocument, { Html, Head, Main, NextScript } from "next/document";

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src="https://umami-alpha-ebon.vercel.app/script.js"
            data-website-id="cc608202-4eca-436d-affd-90de0b9d1256"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
