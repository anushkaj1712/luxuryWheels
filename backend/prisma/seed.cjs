/**
 * Database seed — demo inventory + admin user for local development.
 * Run: npx prisma db seed   (after migrate)
 *
 * Default admin login (change in production):
 *   email: admin@drive-luxury.demo
 *   password: Admin123!
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const cars = [
  {
    slug: "lamborghini-huracan-sto-2023",
    brand: "Lamborghini",
    model: "Huracán STO",
    year: 2023,
    price: 485000,
    mileage: 1200,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    description:
      "Track-born V10 symphony — carbon mastery, aero-sculpted lines, and a cockpit built for apex hunters.",
    features: ["V10 5.2L", "Carbon Ceramic Brakes", "Track Telemetry", "Launch Control"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  {
    slug: "rolls-phantom-extended-2024",
    brand: "Rolls-Royce",
    model: "Phantom Extended",
    year: 2024,
    price: 920000,
    mileage: 400,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    description: "The quietest statement on the road — starlit canopy, bespoke leather, effortless waft.",
    features: ["Starlight Headliner", "Bespoke Audio", "Chauffeur Mode", "Magic Carpet Ride"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  {
    slug: "porsche-911-turbo-s-2023",
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2023,
    price: 245000,
    mileage: 3100,
    fuel: "PETROL",
    transmission: "AUTOMATIC",
    description: "Everyday supercar precision — rear-engine legend with warp-speed overtakes.",
    features: ["640 HP", "Sport Chrono", "PCCB", "Rear Axle Steering"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  {
    slug: "bmw-i7-m70-2024",
    brand: "BMW",
    model: "i7 M70",
    year: 2024,
    price: 189000,
    mileage: 800,
    fuel: "ELECTRIC",
    transmission: "AUTOMATIC",
    description: "Silent executive express — theatre screen rear suite, crystal controls, M-calibrated thrust.",
    features: ["Theatre Screen", "Crystal Controls", "Air Suspension", "Executive Lounge"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@drive-luxury.demo" },
    update: { passwordHash, role: "SUPER_ADMIN" },
    create: {
      email: "admin@drive-luxury.demo",
      name: "DLW Concierge",
      passwordHash,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "ownership" },
    update: { name: "Ownership" },
    create: { name: "Ownership", slug: "ownership", description: "Guides for collectors" },
  });

  await prisma.blog.upsert({
    where: { slug: "art-of-specification" },
    update: { title: "The Art of Specification" },
      title: "The Art of Specification",
      excerpt: "How we curate bespoke builds for discerning collectors.",
      contentHtml: "<p>Luxury is not excess — it is intention. Every stitch, every veneer, every calibration is a decision.</p>",
      published: true,
      categoryId: category.id,
      readingMinutes: 6,
    },
  });

  for (const c of cars) {
    const car = await prisma.car.upsert({
      where: { slug: c.slug },
      update: { price: c.price },
        brand: c.brand,
        model: c.model,
        year: c.year,
        price: c.price,
        mileage: c.mileage,
        fuel: c.fuel,
        transmission: c.transmission,
        description: c.description,
        features: c.features,
        isFeatured: c.isFeatured,
        isAvailable: true,
      },
    });
    const existing = await prisma.carImage.count({ where: { carId: car.id } });
    if (existing === 0 && c.images?.[0]) {
      await prisma.carImage.create({
        data: { carId: car.id, url: c.images[0], alt: `${c.brand} ${c.model}`, sortOrder: 0 },
      });
    }
  }

  await prisma.testimonial.deleteMany({
    where: { name: { in: ["A. Verma", "S. Laurent"] } },
  });
  await prisma.testimonial.createMany({
    data: [
      {
        name: "A. Verma",
        role: "Founder, Apex Holdings",
        quote: "DLW orchestrated a cross-border acquisition flawlessly — white-glove beyond expectation.",
        rating: 5,
        featured: true,
      },
      {
        name: "S. Laurent",
        role: "Creative Director",
        quote: "The configurator session felt like haute couture for automobiles.",
        rating: 5,
        featured: true,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
