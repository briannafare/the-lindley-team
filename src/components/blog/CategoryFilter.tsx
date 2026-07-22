"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All Posts";
  const [active, setActive] = useState(initialCategory);

  function handleSelect(category: string) {
    setActive(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All Posts") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const query = params.toString();
    router.push(query ? `/blog?${query}` : "/blog", { scroll: false });
  }

  return (
    <div className="mobile-rail -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={`min-h-11 shrink-0 snap-start px-5 py-2.5 rounded-full text-[0.72rem] font-bold tracking-[0.06em] uppercase transition-colors ${
              isActive
                ? "bg-ink text-white"
                : "border border-border text-ink-mid hover:border-ink hover:text-ink"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
