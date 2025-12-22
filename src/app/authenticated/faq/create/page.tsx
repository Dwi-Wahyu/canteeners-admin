import FaqForm from "@/features/faq/ui/faq-form";

export const metadata = {
  title: "Buat FAQ Baru",
};

export default function CreateFaqPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="mx-auto container max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight">Buat FAQ Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan pertanyaan dan jawaban baru.
        </p>
      </div>

      <FaqForm mode="create" />
    </div>
  );
}
