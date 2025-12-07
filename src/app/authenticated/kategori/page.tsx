import { getCategories } from "@/features/categories/lib/category-queries";
import CategoryAdminCard from "@/features/categories/ui/category-admin-card";
import Link from "next/link";

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1>Kategori</h1>

      <Link href={"/authenticated/kategori/create"}>Input kategori</Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryAdminCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
