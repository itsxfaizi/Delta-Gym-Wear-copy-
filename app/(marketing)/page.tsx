import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductRangeSection } from "@/components/home/ProductRangeSection";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { StandardSection } from "@/components/home/StandardSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { prisma } from "@/lib/prisma";

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  imageUrl: string;
  startingPrice: string | null;
  sizes: Array<{ size: string; isOutOfStock: boolean }>;
};

export const metadata: Metadata = {
  title: "Performance Apparel for Intentional Training",
  description: "Delta builds precise, durable gym wear for athletes who train with intent.",
  openGraph: { title: "Delta Gym Wear - Function First", description: "Performance apparel engineered for disciplined training." },
};

async function getHomeProducts(): Promise<HomeProduct[]> {
  const baseQuery = {
    where: { status: "ACTIVE" as const },
    take: 5,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: {
        where: { isActive: true },
        orderBy: { price: "asc" as const },
      },
    },
    orderBy: { createdAt: "desc" as const },
  };

  try {
    const featuredProducts = await prisma.product.findMany({
      ...baseQuery,
      where: { ...baseQuery.where, isFeatured: true },
    });
    const products = featuredProducts.length > 0 ? featuredProducts : await prisma.product.findMany(baseQuery);

    return products.map((product) => {
      const sizes = Array.from(
        product.variants
          .reduce((map, variant) => {
            if (!map.has(variant.size)) {
              map.set(variant.size, { size: variant.size, isOutOfStock: variant.stock === 0 });
            }
            return map;
          }, new Map<string, { size: string; isOutOfStock: boolean }>())
          .values(),
      );

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        subtitle: product.subtitle,
        imageUrl: product.images[0]?.url ?? `https://picsum.photos/seed/${product.slug}/600/750`,
        startingPrice: product.variants[0]?.price.toString() ?? null,
        sizes,
      };
    });
  } catch {
    return [];
  }
}

async function getPhilosophyImageUrl() {
  try {
    const featuredProduct = await prisma.product.findFirst({
      where: { status: "ACTIVE", isFeatured: true },
      include: {
        images: {
          where: { isPrimary: false },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return featuredProduct?.images[0]?.url ?? "https://picsum.photos/seed/delta-philosophy/800/1000";
  } catch {
    return "https://picsum.photos/seed/delta-philosophy/800/1000";
  }
}

export default async function HomePage() {
  const [products, philosophyImageUrl] = await Promise.all([getHomeProducts(), getPhilosophyImageUrl()]);

  return (
    <>
      <HeroSection />
      <ProductRangeSection products={products} />
      <PhilosophySection imageUrl={philosophyImageUrl} />
      <StandardSection />
      <NewsletterSection />
    </>
  );
}
