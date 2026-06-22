import { config as loadEnv } from "dotenv";
import { PrismaClient, ProductStatus, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { generateSlug } from "../lib/utils/slug";

loadEnv({ path: ".env.local" });
loadEnv();

const directUrl = process.env.DIRECT_URL;
if (!directUrl) {
  throw new Error("DIRECT_URL is required to seed the database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: directUrl })) });

const categories = [
  { name: "Compression T-Shirts", slug: "compression-t-shirts", sortOrder: 1 },
  { name: "Performance Leggings", slug: "performance-leggings", sortOrder: 2 },
  { name: "Training Tank Tops", slug: "training-tank-tops", sortOrder: 3 },
  { name: "Functional Trousers", slug: "functional-trousers", sortOrder: 4 },
];

const productSeeds = [
  ["vector-compression-tee", "Vector Compression Tee", "Compression T-Shirts", 3200],
  ["delta-core-compression-tee", "Delta Core Compression Tee", "Compression T-Shirts", 2900],
  ["strike-seamless-tee", "Strike Seamless Tee", "Compression T-Shirts", 3500],
  ["form-performance-legging", "Form Performance Legging", "Performance Leggings", 5200],
  ["apex-training-legging", "Apex Training Legging", "Performance Leggings", 5800],
  ["motion-high-rise-legging", "Motion High Rise Legging", "Performance Leggings", 4900],
  ["intent-training-tank", "Intent Training Tank", "Training Tank Tops", 2500],
  ["rep-range-tank", "Rep Range Tank", "Training Tank Tops", 2800],
  ["airflow-stringer-tank", "Airflow Stringer Tank", "Training Tank Tops", 3100],
  ["axis-training-trouser", "Axis Training Trouser", "Functional Trousers", 7200],
  ["discipline-tapered-trouser", "Discipline Tapered Trouser", "Functional Trousers", 8500],
  ["rest-day-tech-trouser", "Rest Day Tech Trouser", "Functional Trousers", 6800],
] as const;

function skuFor(slug: string, size: string) {
  return `DELTA-${slug
    .split("-")
    .map((part) => part.slice(0, 3).toUpperCase())
    .join("")}-${size}`;
}

async function main() {
  const passwordHash = await bcrypt.hash("786DeltaZero01", 12);

  await prisma.user.upsert({
    where: { email: "admin@deltagymwear.com" },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
      name: "Delta Admin",
    },
    create: {
      email: "admin@deltagymwear.com",
      emailVerified: new Date(),
      passwordHash,
      name: "Delta Admin",
      role: Role.SUPER_ADMIN,
    },
  });

  const categoryByName = new Map<string, string>();

  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        ...category,
        isActive: true,
      },
      create: {
        ...category,
        description: `${category.name} engineered for disciplined training in Pakistan.`,
        image: `https://picsum.photos/seed/delta-${category.slug}/600/750`,
      },
    });
    categoryByName.set(saved.name, saved.id);
  }

  const tags = [
    { name: "Training", slug: "training" },
    { name: "Performance", slug: "performance" },
    { name: "New Season", slug: "new-season" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  for (const [slug, name, categoryName, basePrice] of productSeeds) {
    if (generateSlug(name) !== slug) {
      throw new Error(`Product slug mismatch for ${name}`);
    }

    const categoryId = categoryByName.get(categoryName);
    if (!categoryId) throw new Error(`Missing category ${categoryName}`);

    const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    const isFeatured = slug.includes("vector") || slug.includes("axis") || slug.includes("intent");

    if (existing) {
      await prisma.product.update({
        where: { slug },
        data: {
          name,
          categoryId,
          status: ProductStatus.ACTIVE,
          isFeatured,
          subtitle: "Built for repeat training",
          metaTitle: `${name} | Delta Gym Wear`,
          metaDesc: `${name} in PKR from Delta Gym Wear Pakistan.`,
        },
      });
      continue;
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        subtitle: "Built for repeat training",
        description: `${name} uses performance fabric, clean construction, and a fit tuned for serious gym work.`,
        categoryId,
        status: ProductStatus.ACTIVE,
        isFeatured,
        metaTitle: `${name} | Delta Gym Wear`,
        metaDesc: `${name} in PKR from Delta Gym Wear Pakistan.`,
        tags: {
          connect: [{ slug: "training" }, { slug: "performance" }],
        },
        images: {
          create: [
            {
              url: `https://picsum.photos/seed/delta-${slug}/600/750`,
              altText: `${name} primary product image`,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        variants: {
          create: ["S", "M", "L", "XL"].map((size, index) => ({
            sku: skuFor(slug, size),
            size,
            color: index % 2 === 0 ? "Black" : "Yellow",
            price: basePrice + index * 250,
            compareAt: basePrice + 900 + index * 250,
            stock: 18 + index * 4,
            lowStock: 5,
            isActive: true,
          })),
        },
      },
    });
  }

  const now = new Date();
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {
      type: "PERCENTAGE",
      value: 10,
      minOrderValue: 0,
      startsAt: now,
      isActive: true,
    },
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderValue: 0,
      startsAt: now,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {
      type: "FREE_SHIPPING",
      value: 0,
      minOrderValue: 5000,
      startsAt: now,
      isActive: true,
    },
    create: {
      code: "FREESHIP",
      type: "FREE_SHIPPING",
      value: 0,
      minOrderValue: 5000,
      startsAt: now,
      isActive: true,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      storeName: "Delta Gym Wear",
      currency: "PKR",
      freeShipping: 15000,
      shippingRate: 250,
      maintenanceMode: false,
    },
    create: {
      id: "singleton",
      storeName: "Delta Gym Wear",
      currency: "PKR",
      freeShipping: 15000,
      shippingRate: 250,
      maintenanceMode: false,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
