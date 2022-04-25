import type { NextApiRequest, NextApiResponse } from "next";
import { readFileSync } from "fs";
import path from "path";

const OgImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const filePath = path.join("public", "assets", "photos", "og-image.png");
  const image = readFileSync(filePath);
  res.status(200).send(image);
};

export default OgImage;
