import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const Delete = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  if (req.method !== "POST") {
    return res.status(405);
  }

  // TODO: Typing this would probably fix a lot of potential DB write issues.
  // TODO: Consider using something like trpc??
  const items: { idx: number; id: string }[] = req.body;

  type Errors = { ok: false; data: null; error: string }[];
  const errors: Errors = [];

  for (const item of items) {
    try {
      await prisma?.$transaction(async (tx) => {
        // Remove one from every index *after* the index we're removing from
        const _ = await tx.menu.updateMany({
          where: {
            idx: {
              gt: item.idx,
            },
          },
          data: {
            idx: {
              decrement: 1,
            },
          },
        });

        const deleted = await tx.menu.delete({
          where: {
            id: item.id,
          },
        });
      });
    } catch (error) {
      console.error(error);
      errors.push({
        ok: false,
        data: null,
        // @ts-expect-error: TODO: You should probably narrow down the type of errors that can pop up here
        error: error.message,
      });
    }
  }

  if (errors.length !== 0) {
    return res.status(500).json({
      ok: false,
      data: null,
      error: errors,
    });
  }

  return res.status(200).json({
    ok: true,
    data: [],
    error: null,
  });
};

export default Delete;
