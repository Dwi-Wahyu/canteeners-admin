import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { getEvents } from "@/features/event/lib/event-queries";
import { eventColumns } from "@/features/event/ui/event-columns";
import { EventTable } from "@/features/event/ui/event-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "@/features/event/ui/event-form";

export default async function EventPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/authenticated/dashboard");
  }

  const events = await getEvents();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event</h1>
          <p className="text-muted-foreground">Kelola event dan slot diskon</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Event Baru</DialogTitle>
            </DialogHeader>
            <EventForm />
          </DialogContent>
        </Dialog>
      </div>

      <EventTable data={events} columns={eventColumns} />
    </div>
  );
}
