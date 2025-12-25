"use client";

import { Category } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/helper/get-image-url";
import Image from "next/image";
import { deleteCategory } from "../lib/category-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function CategoryAdminCard({
  category,
}: {
  category: Category;
}) {
  return (
    <Card className="group overflow-hidden border-muted/60 hover:border-destructive/30 transition-all duration-300 shadow-sm hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={getImageUrl(category.image_url)}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end p-2">
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 shadow-lg cursor-pointer"
              onClick={async () => {
                const confirmDelete = confirm(
                  `Hapus kategori ${category.name}?`
                );
                if (confirmDelete) await deleteCategory(category.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Info Kategori */}
        <div className="p-3">
          <h3 className="font-semibold text-sm md:text-base text-gray-800 truncate">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Kategori
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
