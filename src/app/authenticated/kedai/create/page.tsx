import { getShopOwners } from "@/features/users/lib/user-queries";
import CreateShopForm from "./create-shop-form";
import { getCanteens } from "@/features/canteen/lib/canteen-queries";

export default async function CreateShopPage() {
  const [owners, canteens] = await Promise.all([
    getShopOwners(),
    getCanteens(),
  ]);

  return <CreateShopForm owners={owners} canteens={canteens} />;
}
