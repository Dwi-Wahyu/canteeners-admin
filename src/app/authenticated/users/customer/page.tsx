import { SearchParams } from "nuqs";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import UsersTable from "../users-table";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerColumns } from "./columns";
import { UserSearchParams } from "@/features/users/types/user-search-params";
import getUsersDataByRole from "@/features/users/lib/user-queries";
import { Suspense } from "react";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CustomerPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = UserSearchParams.parse(searchParams);

  const promises = await getUsersDataByRole(search, "CUSTOMER");

  return (
    <div>
      <Card>
        <CardContent>
          <Suspense fallback={<DataTableSkeleton columnCount={5} />}>
            <UsersTable promises={promises} columns={CustomerColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
