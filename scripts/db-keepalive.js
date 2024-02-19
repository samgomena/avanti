const { PrismaClient } = require("@prisma/client");

async function keepalive() {
  const prisma = new PrismaClient();
  const whatever = await prisma?.alert.findMany();

  console.log(whatever);
}

keepalive();
