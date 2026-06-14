"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const key = `${item.id}-${item.size}`;
          const existing = state.items.find((entry) => `${entry.id}-${entry.size}` === key);
          return {
            items: existing
              ? state.items.map((entry) =>
                  `${entry.id}-${entry.size}` === key
                    ? { ...entry, qty: entry.qty + item.qty }
                    : entry,
                )
              : [...state.items, item],
          };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((item) => `${item.id}-${item.size}` !== id) })),
      update: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            `${item.id}-${item.size}` === id ? { ...item, qty: Math.max(1, qty) } : item,
          ),
        })),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
    }),
    { name: "delta-cart" },
  ),
);
