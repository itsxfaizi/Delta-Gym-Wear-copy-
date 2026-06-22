export interface StorefrontVariant {
  id: string;
  sku: string;
  size: string;
  color: string | null;
  price: number;
  compareAt: number | null;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  compareAt: number | null;
  currency: "PKR";
  category: string;
  categorySlug: string;
  sizes: string[];
  images: string[];
  description: string;
  variants: StorefrontVariant[];
}

export function primaryImage(product: Product) {
  return product.images[0] ?? `https://picsum.photos/seed/delta-${product.slug}/600/750`;
}
