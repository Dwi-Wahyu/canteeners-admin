"use client";

import { Category } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/helper/get-image-url";
import Image from "next/image";
import { deleteCategory } from "../lib/category-actions";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export default function CategoryAdminCard({
  category,
}: {
  category: Category;
}) {
  return (
    <Card key={category.id}>
      <CardContent>
        <Image
          src={getImageUrl(category.image_url)}
          alt=""
          width={400}
          height={400}
          className="rounded-lg shadow mb-2"
        />

        <h1>{category.name}</h1>

        <Button
          variant={"destructive"}
          onClick={async () => await deleteCategory(category.id)}
        >
          <Delete />
        </Button>
      </CardContent>
    </Card>
  );
}
