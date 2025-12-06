import { Card, CardContent } from "@/components/ui/card";
import { getCanteens } from "@/features/canteen/lib/canteen-queries";

export default async function KantinPage() {
  const canteens = await getCanteens();

  return (
    <div>
      <h1>Daftar Kantin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {canteens.map((canteen) => (
          <Card key={canteen.id}>
            <CardContent>
              <img src={canteen.image_url} alt="" />

              <h1>{canteen.name}</h1>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
