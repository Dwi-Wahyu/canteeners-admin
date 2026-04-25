import { getDiscountById } from "@/features/discount/lib/discount-queries";
import { DiscountForm } from "@/features/discount/ui/discount-form";
import { notFound } from "next/navigation";

interface EditVoucherPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVoucherPage(props: EditVoucherPageProps) {
  const { id } = await props.params;
  const discount = await getDiscountById(id);

  if (!discount) {
    notFound();
  }

  return (
    <div className="p-6">
      <DiscountForm initialData={discount} />
    </div>
  );
}
