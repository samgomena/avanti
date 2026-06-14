import { useEffect, useState } from "react";

export default function DatabaseIndicator() {
  const [dbInfo, setDbInfo] = useState<{ name: string; url: string } | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    const url = process.env.NEXT_PUBLIC_DATABASE_URL;
    if (url) {
      // Extract database name from connection string
      const dbName = url.split("/").pop()?.split("?")[0] || "unknown";
      setDbInfo({ name: dbName, url });
    }
  }

  // Don't render anything during SSR or if not in development
  if (
    !isClient ||
    !dbInfo ||
    process.env.NEXT_PUBLIC_NODE_ENV !== "development"
  ) {
    return null;
  }

  console.log("### dbInfo", dbInfo);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#22c55e",
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "14px",
        zIndex: 9999,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "help",
      }}
      title={dbInfo.url}
    >
      DB: {dbInfo.name}
    </div>
  );
}
