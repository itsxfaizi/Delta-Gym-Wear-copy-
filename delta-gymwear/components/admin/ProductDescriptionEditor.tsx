"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function ProductDescriptionEditor({ name = "description" }: { name?: string }) {
  const [value, setValue] = useState("");

  return (
    <div data-color-mode="light">
      <input type="hidden" name={name} value={value} />
      <MDEditor value={value} onChange={(nextValue) => setValue(nextValue ?? "")} preview="edit" height={260} />
    </div>
  );
}
