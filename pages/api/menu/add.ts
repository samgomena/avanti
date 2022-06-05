import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { Menu } from "../../../lib/types/menu";

const Add = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  const menu = JSON.parse(
    fs.readFileSync(`${process.cwd()}/data/menu.json`, "utf-8")
  ) as Menu;

  if (req.method === "GET") {
    return res.status(200).json(menu);
  }

  if (req.method === "POST") {
    const newMenuItems = JSON.parse(req.body);
    menu.items.push(...newMenuItems.items);
    fs.writeFileSync(
      `${process.cwd()}/data/menu.json`,
      JSON.stringify(menu, null, 2)
    );
    return res.status(200).json(menu);
  }
};

export default Add;
