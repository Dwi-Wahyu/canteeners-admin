import { getShopOwners } from "@/features/users/lib/user-queries";
import CreateShopForm from "./create-shop-form";

export default async function CreateShopPage() {
  const owners = await getShopOwners();

  return <CreateShopForm owners={owners} />;
}
