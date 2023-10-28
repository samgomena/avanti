import { Services } from "@prisma/client";
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
    const fuckingWhat = await prisma?.$transaction([
      // @ts-expect-error: Fix dis
      ...items.map((item) =>
        prisma?.menu.update({
          include: {
            price: true,
          },
          where: { id: item.id },
          data: {
            idx: item.idx,
            name: item.name,
            description: item.description,
            course: item.course,
            service: Services.dinner,
            disabled: item.disabled,
            price: {
              update: {
                dinner: item.price.dinner,
                lunch: item.price.lunch,
                hh: item.price.hh,
                drinks: item.price.drinks,
                dessert: item.price.dessert,
              },
            },
          },
        })
      ),
    ]);
    return res.status(200).json({
      ok: true,
      data: fuckingWhat,
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      data: null,
      error,
    });
  }

  // for (const item of items) {
  //   try {
  //     const updated = await prisma?.menu.updateMany({
  //       data: items
  //     })
  //     await prisma?.$transaction(async (tx) => {
  //       const updated = await tx?.menu.update({
  //         where: { id: item.id },
  //         data: {
  //           idx: item.idx,
  //           name: item.name,
  //           description: item.description,
  //           course: item.course,
  //           service: Services.dinner,
  //           disabled: false,
  //           price: {
  //             update: {
  //               dinner: item.price.dinner,
  //               lunch: item.price.lunch,
  //               hh: item.price.hh,
  //               drinks: item.price.drinks,
  //               dessert: item.price.dessert,
  //             },
  //           },
  //         },
  //       });
  //       console.log(updated);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({
  //       ok: false,
  //       data: null,
  //       error,
  //     });
  //   }
  // }

  return res.status(200).json({
    ok: true,
    data: [],
    error: null,
  });
};

export default Edit;
