"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-72 border border-zinc-200 bg-white p-4">
      <h2 className="text-sm font-black uppercase tracking-wider">Revenue last 7 days</h2>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#e4e4e7" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip cursor={{ fill: "#f4f4f5" }} />
            <Bar dataKey="revenue" fill="#F5C100" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
