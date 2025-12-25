import { getFaqs } from "@/features/faq/lib/faq-queries";
import FaqCard from "@/features/faq/ui/faq-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Daftar FAQ",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FAQ</h1>
          <p className="text-muted-foreground">
            Kelola pertanyaan umum untuk pengguna.
          </p>
        </div>
        <Button asChild>
          <Link href="/authenticated/faq/create">
            <Plus />
            Tambah FAQ
          </Link>
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Belum ada data FAQ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faqs.map((faq) => (
            <FaqCard key={faq.id} faq={faq} />
          ))}
        </div>
      )}
    </div>
  );
}
