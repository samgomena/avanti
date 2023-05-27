import { Services } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const Add = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const items: any = req.body.items;

  for (const item of items) {
    try {
      // TODO(5/26/23): This should be wrapped in a transaction so we don't increment all the indexes
      // if the create fails
      const lastIndex = await prisma?.menu.findFirst({
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
        return res.status(500).json({
          ok: false,
          data: null,
          error: `Couldn't find index to insert ${item.name}`,
        });
      }

      // Add one to every index *after* the index we're inserting at
      const _ = await prisma?.menu.updateMany({
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

      const created = await prisma?.menu.create({
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        data: null,
        error,
      });
    }
  }

  return res.status(201).json({
    ok: true,
    data: [],
    error: null,
  });
};

export default Add;
