import { Services } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authConfig } from "../auth/[...nextauth]";

const Add = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  const session = await getServerSession(req, res, authConfig);
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
  const items: any = req.body.items;

  type Errors = { ok: false; data: null; error: string }[];
  const errors: Errors = [];

  for (const item of items) {
    try {
      await prisma?.$transaction(async (tx) => {
        const lastIndex = await tx.menu.findFirst({
          where: {
            course: {
              equals: item.course,
            },
          },
          orderBy: {
            idx: "desc",
          },
          select: {
            idx: true,
          },
        });

        if (!lastIndex) {
          errors.push({
            ok: false,
            data: null,
            error: `Couldn't find index to insert ${item.name} at`,
          });
          throw new Error(`Couldn't find index to insert ${item.name} at`);
        }

        // Add one to every index *after* the index we're inserting at
        const _ = await tx.menu.updateMany({
          where: {
            idx: {
              gt: lastIndex.idx,
            },
          },
          data: {
            idx: {
              increment: 1,
            },
          },
        });

        const created = await tx.menu.create({
          data: {
            idx: lastIndex ? lastIndex.idx + 1 : 0,
            name: item.name,
            description: item.description,
            course: item.course,
            service: Services.dinner,
            disabled: false,
            price: {
              create: {
                dinner: item.price.dinner,
                lunch: item.price.lunch,
                hh: item.price.hh,
                drinks: item.price.drinks,
                dessert: item.price.dessert,
              },
            },
          },
        });
        console.info(created);
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

  return res.status(201).json({
    ok: true,
    data: [],
    error: null,
  });
};

export default Add;
