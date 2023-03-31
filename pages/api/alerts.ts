import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const Alerts = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: Auth
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  const title = req.body.title ?? "";
  const text = req.body.text;
  const start = req.body.start;
  const end = req.body.end;
  const data = { title, text, start: new Date(start), end: new Date(end) };

  if (req.method === "POST") {
    try {
      const alert = await prisma?.alert.create({ data });

      return res.status(201).json({
        ok: true,
        data: alert,
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: null,
        error,
      });
    }
  }

  if (req.method === "PATCH") {
    const id = req.body.id;
    try {
      const updated = await prisma.alert.update({
        data,
        where: {
          id,
        },
      });

      res.status(200).json({
        ok: true,
        data: updated,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        data: null,
        error,
      });
    }
  }

  if (req.method === "DELETE") {
    const id = req.body.id;

    try {
      const deleted = await prisma.alert.delete({
        where: {
          id,
        },
      });
      res.status(200).json({
        ok: true,
        data: deleted,
        error: null,
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        data: null,
        error,
      });
    }
  }
};

export default Alerts;
