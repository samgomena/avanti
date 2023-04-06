import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const EditInfo = async (req: NextApiRequest, res: NextApiResponse) => {
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

  // Only allow updates
  if (req.method !== "POST") {
    return res.status(405);
  }

  // TODO: Optimize to only update the fields that have actually changed??
  // TODO: Probably also don't need to be given/return ids on all the objects since other fields guarantee uniqueness (e.g. hours->day)
  const infoId = req.body.id;
  const contactId = req.body.contactId;

  // Update the Info model
  try {
    const updates = await prisma?.$transaction([
      prisma.info.update({
        where: { id: infoId },
        data: {
          about: req.body.about,
          // Update contact info
          contact: {
            update: req.body.contact,
            connect: { id: contactId },
          },
        },
        include: {
          contact: true,
        },
      }),
      // Update hours info
      ...req.body.hours.map(
        (hour: { id: string; open?: string; close?: string }) =>
          prisma?.hours.update({
            where: { id: hour.id },
            data: { open: hour.open, close: hour.close },
          })
      ),
    ]);

    // "massage" updated data into the format we want (i.e. the shape of the request)
    const [info, ...hours] = updates ?? [];
    const updatedInfo = {
      ...info,
      hours,
    };

    return res.status(200).json({
      ok: true,
      data: updatedInfo,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      data: null,
      error,
    });
  }
};

export default EditInfo;
