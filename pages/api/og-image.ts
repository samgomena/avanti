import type { NextApiRequest, NextApiResponse } from "next";
import { readdirSync, readFileSync } from "fs";
import path from "path";

const OgImage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filePath = path.join("data", "og-image.png");
    const image = readFileSync(filePath);
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(image);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default OgImage;
