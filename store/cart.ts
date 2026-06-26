"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  image?: string;
}

interface ApiCartItem {
  id: string;
  variantId: string;
  quantity: number;
}

interface ApiCart {
  items: ApiCartItem[];
}

interface CartStore {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  total: () => number;
  clear: () => void;
}

async function getApiCart() {
  const response = await fetch("/api/cart", { method: "GET" });
  if (!response.ok) return null;
  const payload = (await response.json()) as { data: ApiCart };
  return payload.data;
}

async function findApiCartItem(variantId: string) {
  const cart = await getApiCart();
  return cart?.items.find((item) => item.variantId === variantId) ?? null;
}

async function addApiCartItem(variantId: string, quantity: number) {
  await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, quantity }),
  });
}

async function updateApiCartItem(variantId: string, quantity: number) {
  const item = await findApiCartItem(variantId);
  if (!item) return;
  await fetch(`/api/cart/items/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
}

async function removeApiCartItem(variantId: string) {
  const item = await findApiCartItem(variantId);
  if (!item) return;
  await fetch(`/api/cart/items/${item.id}`, { method: "DELETE" });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        set((state) => {
          const existing = state.items.find((entry) => entry.variantId === item.variantId);
          return {
            items: existing
              ? state.items.map((entry) =>
                  entry.variantId === item.variantId ? { ...entry, qty: entry.qty + item.qty } : entry,
                )
              : [...state.items, item],
          };
        });
        void addApiCartItem(item.variantId, item.qty);
      },
      remove: (id) => {
        const item = get().items.find((entry) => entry.id === id);
        set((state) => ({ items: state.items.filter((entry) => entry.id !== id) }));
        if (item) void removeApiCartItem(item.variantId);
      },
      update: (id, qty) => {
        const nextQty = Math.max(1, qty);
        const item = get().items.find((entry) => entry.id === id);
        set((state) => ({
          items: state.items.map((entry) => (entry.id === id ? { ...entry, qty: nextQty } : entry)),
        }));
        if (item) void updateApiCartItem(item.variantId, nextQty);
      },
      total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
      clear: () => set({ items: [] }),
    }),
    { name: "delta-cart" },
  ),
);
