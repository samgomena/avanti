import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authConfig } from "../auth/[...nextauth]";

const Edit = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const items = req.body.items;

  try {
    const menu = await prisma?.$transaction([
      // @ts-expect-error: Fix dis
      ...items.map((item) =>
        prisma?.menu.update({
          include: {
            price: true,
          },
          where: { id: item.id },
          data: {
            ...item,
            price: {
              update: {
                // Map item prices to strings because the frontend doesn't do it
                ...Object.entries(
                  // The price object is null/undefined if we haven't updated the items price
                  item.price ?? {}
                ).reduce(
                  (acc, [key, val]) => ({
                    ...acc,
                    // `val` will be null/undefined for fields where the course doesn't have a price
                    // E.g. drinks won't have a `lunch` or `dinner` price but will have a `drinks` price obvi
                    [key]: val?.toString() ?? "",
                  }),
                  {}
                ),
              },
            },
          },
        })
      ),
      // Fetch entire menu as our last order of business because the frontend is stoopid and can't
      // selectively update the form with partial data
      prisma?.menu.findMany({
        orderBy: [
          {
            course: "asc",
          },
          { idx: "asc" },
        ],
        select: {
          id: true,
          idx: true,
          name: true,
          description: true,
          course: true,
          disabled: true,
          price: {
            select: {
              id: true,
              lunch: true,
              dinner: true,
              drinks: true,
              dessert: true,
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      ok: true,
      // $transaction returns an array of the results of each query, so we want the last item which is the updated menu
      data: menu?.at(-1),
      error: null,
    });
  } catch (error) {
    console.error(`There was an error editing the menu:`, error);
    return res.status(500).json({
      ok: false,
      data: null,
      error,
    });
  }
};

export default Edit;
