import "dotenv/config";
import { prisma } from "../src/lib/db";

function nextSunday11(): Date {
  const now = new Date();
  const d = new Date(now);
  const add = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + add);
  d.setHours(11, 0, 0, 0);
  if (d < now) d.setDate(d.getDate() + 7);
  return d;
}

async function main() {
  const title = "D&D One-Shot Sundays";
  const description =
    "Weekly D&D one-shots every Sunday from 11:00 AM to 5:00 PM. Drop-in friendly for new and returning players.";

  let date = nextSunday11();
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < 12; i++) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(17, 0, 0, 0);

    const exists = await prisma.event.findFirst({
      where: { title, date: start },
      select: { id: true },
    });

    if (exists) {
      skipped++;
    } else {
      await prisma.event.create({
        data: {
          title,
          description,
          date: start,
          endDate: end,
          type: "DND_NIGHT",
          capacity: 24,
          price: 10,
          image: "/images/placeholder.jpg",
        },
      });
      created++;
    }

    date.setDate(date.getDate() + 7);
  }

  console.log(JSON.stringify({ created, skipped }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
