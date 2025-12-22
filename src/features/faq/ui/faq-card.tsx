"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";
import { deleteFaq } from "../lib/faq-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

export default function FaqCard({ faq }: { faq: Faq }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Apakah anda yakin ingin menghapus FAQ ini?"
    );
    if (!confirm) return;

    const res = await deleteFaq(faq.id);
    if (res.success) {
      toast.success("FAQ berhasil dihapus");
    } else {
      toast.error("Gagal menghapus FAQ");
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-lg">{faq.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap mb-4 line-clamp-3">
          {faq.answer}
        </p>

        <div className="flex justify-end gap-2 mt-auto">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/authenticated/faq/${faq.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>

          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
