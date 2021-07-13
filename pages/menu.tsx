import Image from "next/image";

export default function Menu() {
  return (
    <>
      <h1>Menu</h1>
      <Image
        src="/images/porkchop_in_window.jpg"
        height={144}
        width={144}
        alt="Smoked Double-Cut Porkchop"
      />
    </>
  );
}
