import { getFaqById } from "@/features/faq/lib/faq-queries";
import FaqForm from "@/features/faq/ui/faq-form";
import { notFound } from "next/navigation";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;
  const faq = await getFaqById(parseInt(id));

  if (!faq) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto container max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight">Edit FAQ</h1>
        <p className="text-muted-foreground">
          Ubah data pertanyaan dan jawaban.
        </p>
      </div>

      <FaqForm mode="edit" initialData={faq} />
    </div>
  );
}
