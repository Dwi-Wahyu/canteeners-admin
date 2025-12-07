import { Card, CardContent } from "@/components/ui/card";
import { getCanteens } from "@/features/canteen/lib/canteen-queries";
import Image from "next/image";

export default async function KantinPage() {
  const canteens = await getCanteens();

  return (
    <div>
      <h1>Daftar Kantin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {canteens.map((canteen) => (
          <Card key={canteen.id}>
            <CardContent>
              <Image
                src={
                  "https://mwozu5eodkq4uc39.public.blob.vercel-storage.com/" +
                  canteen.image_url
                }
                alt=""
                width={400}
                height={400}
                className="rounded-lg shadow mb-2"
              />

              <h1>{canteen.name}</h1>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
