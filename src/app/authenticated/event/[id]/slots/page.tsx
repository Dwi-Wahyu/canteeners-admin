import { auth } from "@/config/auth";
import { redirect, notFound } from "next/navigation";
import { getEventById, getEventSlots } from "@/features/event/lib/event-queries";
import { eventSlotColumns } from "@/features/event/ui/event-slot-columns";
import { EventSlotTable } from "@/features/event/ui/event-slot-table";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventSlotForm } from "@/features/event/ui/event-slot-form";
import Link from "next/link";
import { SearchParams } from "nuqs";
import { EventSlotSearchParams } from "@/features/event/types/event-slot-search-params";

export default async function EventSlotsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const search = EventSlotSearchParams.parse(sParams);

  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const eventId = parseInt(id);
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  const slotsPromises = await getEventSlots(eventId, search);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <Link
          href="/authenticated/event"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Kembali ke Daftar Event
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Slot Event: {event.name}
            </h1>
            <p className="text-muted-foreground">
              Kelola jadwal dan kuota untuk event ini
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Slot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Slot Baru</DialogTitle>
              </DialogHeader>
              <EventSlotForm eventId={eventId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <EventSlotTable promises={slotsPromises} columns={eventSlotColumns} />
    </div>
  );
}
