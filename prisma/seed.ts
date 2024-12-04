import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Do nothing if we've already created it
  if (await prisma.info.findFirst()) {
    return;
  }

  await prisma.info.create({
    data: {
      about: "Another example description",
      contact: {
        create: {
          email: "test@example.com",
          address: "123 Example St.",
          phone: "123-456-7890",
          instagram: "https://www.instagram.com/example",
          facebook: "https://www.facebook.com/example",
        },
      },
      hours: {
        create: [
          {
            day: "monday",
            open: "",
            close: "",
          },
          {
            day: "tuesday",
            open: "16:00",
            close: "21:00",
          },
          {
            day: "wednesday",
            open: "16:00",
            close: "21:00",
          },
          {
            day: "thursday",
            open: "16:00",
            close: "21:00",
          },
          {
            day: "friday",
            open: "16:00",
            close: "22:00",
          },
          {
            day: "saturday",
            open: "16:00",
            close: "22:00",
          },
          {
            day: "sunday",
            open: "16:00",
            close: "21:00",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
