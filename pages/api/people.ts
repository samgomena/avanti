import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authConfig } from "./auth/[...nextauth]";

const prisma = new PrismaClient();
const adapter = PrismaAdapter(prisma);

const User = async (req: NextApiRequest, res: NextApiResponse) => {
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

  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;

  switch (req.method) {
    case "POST":
      return await createUser(res, {
        name,
        email,
      });
    case "PATCH":
      return await updateUser(res, {
        id,
        name,
        email,
      });
    case "DELETE":
      return await deleteUser(res, id);
  }
};

export default User;

type UpsertUser = {
  id?: string;
  name: string;
  email: string;
};
const createUser = async (
  res: NextApiResponse,
  { name, email }: UpsertUser
) => {
  console.log(name, email);
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(201).json({
      ok: true,
      error: null,
      data: newUser,
    });
    return;
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      data: null,
    });
  }
};

const updateUser = async (
  res: NextApiResponse,
  { id, name, email }: UpsertUser
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        updatedAt: new Date(),
      },
    });
    res.status(200).json({
      ok: true,
      error: null,
      data: updatedUser,
    });
    return;
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      data: null,
    });
  }
};

const deleteUser = async (res: NextApiResponse, userId: string) => {
  try {
    // `deleteUser` is defined for the prisma adapter
    // See: https://github.com/nextauthjs/next-auth/blob/a220245d0341c40e49d40f4f1c52955ff008dbca/packages/adapter-prisma/src/index.ts#L236
    const deleted = await adapter.deleteUser!(userId);
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // console.log("Found user:", user);
    // const deleted = await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({
      ok: true,
      error: null,
      data: deleted,
    });
    return;
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      data: null,
    });
  }
};
