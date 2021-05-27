import Image from "next/image";

import Layout from "../components/layout";

export default function Menu() {
  return (
    <Layout>
      <>
        <h1>Menu</h1>
        <Image
          src="/images/porkchop_in_window.jpg"
          height={144}
          width={144}
          alt="Porkchop in Window"
        />
      </>
    </Layout>
  );
}
