import { getShopViolations } from "../lib/shop-violation-queries";
import { ShopViolationItem } from "./shop-violation-item";

export async function ShopViolationList({ shopId }: { shopId: string }) {
  const violations = await getShopViolations(shopId);

  if (violations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic py-2">
        Belum ada catatan pelanggaran untuk kedai ini.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {violations.map((v) => (
        <ShopViolationItem key={v.id} violation={v} />
      ))}
    </div>
  );
}
