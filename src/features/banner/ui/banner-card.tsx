"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteBanner } from "../lib/banner-actions";
import { toast } from "sonner";
import Link from "next/link";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/helper/get-image-url";
import { Banner } from "@/generated/prisma";

export default function BannerCard({ banner }: { banner: Banner }) {
  const handleDelete = async () => {
    if (confirm("Apakah anda yakin ingin menghapus banner ini?")) {
      const res = await deleteBanner(banner.id);
      if (res.success) {
        toast.success("Banner berhasil dihapus");
      } else {
        toast.error(res.error || "Gagal menghapus banner");
      }
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-video w-full">
        <img
          src={getImageUrl("/banners/" + banner.file)}
          alt={`Banner ${banner.order}`}
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Urutan: {banner.order}</span>
          {banner.cta_path && (
            <Link
              href={banner.cta_path}
              target="_blank"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 grow">
        <p className="text-sm text-muted-foreground truncate">
          {banner.cta_path || "Tidak ada CTA path"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/authenticated/banner/${banner.id}`}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
