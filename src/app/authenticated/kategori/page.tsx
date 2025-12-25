import NavButton from "@/components/nav-button";
import { getCategories } from "@/features/categories/lib/category-queries";
import CategoryAdminCard from "@/features/categories/ui/category-admin-card";
import { Tags } from "lucide-react";

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground">Kategori Produk</p>
        </div>
        <NavButton href="/authenticated/kategori/create">
          <Tags />
          Tambah Kategori
        </NavButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryAdminCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
