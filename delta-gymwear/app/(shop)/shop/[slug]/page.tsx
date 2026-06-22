import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveProductSlugs, getStorefrontProduct } from "@/lib/product-data";
import { primaryImage } from "@/lib/products";
import { ProductDetail } from "@/components/shop/ProductDetail";

export const revalidate = 1800;

export async function generateStaticParams() {
  const products = await getActiveProductSlugs();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { title: product.name, description: product.description.slice(0, 160), images: [primaryImage(product)] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStorefrontProduct(slug);
  if (!product) notFound();
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => new URL(image, "https://deltagymwear.com").toString()),
    sku: product.variants[0]?.sku ?? product.id,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      url: `https://deltagymwear.com/shop/${product.slug}`,
    },
  };

  return (
    <div className="bg-white pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
