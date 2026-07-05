const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const city = await prisma.city.upsert({
    where: { slug: "baku-city" },
    update: {},
    create: {
      name: "Baku City",
      slug: "baku-city",
      order: 1,
    },
  });

  const buildings = [
    ["Small House", "small-house", 500, 20, 5],
    ["Villa", "villa", 1500, 60, 7],
    ["Apartment", "apartment", 4000, 150, 10],
    ["Business Center", "business-center", 10000, 400, 12],
    ["Hotel", "hotel", 25000, 1000, 15],
  ];

  for (const [name, slug, price, incomePerMinute, maxLevel] of buildings) {
    await prisma.building.upsert({
      where: { slug },
      update: {},
      create: { name, slug, price, incomePerMinute, maxLevel },
    });
  }

  const plots = Array.from({ length: 12 }).map((_, i) => ({
    cityId: city.id,
    name: `Plot ${i + 1}`,
    zone: i < 4 ? "Cheap" : i < 8 ? "Middle" : "Premium",
    price: i < 4 ? 300 + i * 100 : i < 8 ? 1000 + i * 250 : 3000 + i * 500,
    baseIncome: i < 4 ? 10 + i * 5 : i < 8 ? 40 + i * 10 : 100 + i * 25,
    buildTime: 60,
    order: i + 1,
  }));

  for (const plot of plots) {
    const existing = await prisma.plot.findFirst({
      where: { cityId: city.id, order: plot.order },
    });

    if (!existing) {
      await prisma.plot.create({ data: plot });
    }
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
