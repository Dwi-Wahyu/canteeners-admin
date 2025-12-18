import { getCanteenById } from "@/features/canteen/lib/canteen-queries";
import { notFound } from "next/navigation";

export default async function EditCanteenPage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const canteen = await getCanteenById(parseInt(canteen_id));

  if (!canteen) {
    return notFound();
  }

  return (
    <div>
      <h1>Edit form</h1>
    </div>
  );
}
