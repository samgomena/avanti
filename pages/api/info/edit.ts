import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { Info } from "../../../lib/types/info";

const EditInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  const info = JSON.parse(
    fs.readFileSync(`${process.cwd()}/data/info.json`, "utf-8")
  ) as Info;

  if (req.method === "GET") {
    return res.status(200).json(info);
  }

  if (req.method === "POST") {
    const updatedInfo = JSON.parse(req.body);
    fs.writeFileSync(
      `${process.cwd()}/data/info.json`,
      JSON.stringify(updatedInfo, null, 2)
    );
    return res.status(200).json(updatedInfo);
  }
};

export default EditInfo;
