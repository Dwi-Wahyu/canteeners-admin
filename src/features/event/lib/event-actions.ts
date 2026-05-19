"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EventSchema, EventSlotSchema } from "./event-schema";

async function checkSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") {
    throw new Error("Unauthorized: Only SUPERADMIN can perform this action");
  }
}

export async function createEvent(data: any) {
  await checkSuperAdmin();
  const validated = EventSchema.parse(data);

  const event = await prisma.event.create({
    data: validated,
  });

  revalidatePath("/authenticated/event");
  return { success: true, data: event };
}

export async function updateEvent(id: number, data: any) {
  await checkSuperAdmin();
  const validated = EventSchema.parse(data);

  const event = await prisma.event.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/authenticated/event");
  return { success: true, data: event };
}

export async function deleteEvent(id: number) {
  await checkSuperAdmin();

  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/authenticated/event");
  return { success: true };
}

export async function createEventSlot(data: any) {
  await checkSuperAdmin();
  
  // Convert string times to Date objects for the specific date
  const { date, start_time, end_time, ...rest } = EventSlotSchema.parse(data);
  
  const start = data.exact_start ? new Date(data.exact_start) : new Date(date);
  if (!data.exact_start) {
    const [startH, startM] = start_time.split(":").map(Number);
    start.setHours(startH, startM, 0, 0);
  }

  const end = data.exact_end ? new Date(data.exact_end) : new Date(date);
  if (!data.exact_end) {
    const [endH, endM] = end_time.split(":").map(Number);
    end.setHours(endH, endM, 0, 0);
  }

  const slot = await prisma.eventSlot.create({
    data: {
      ...rest,
      date: data.exact_start ? new Date(data.exact_start) : date,
      start_time: start,
      end_time: end,
    },
  });

  revalidatePath(`/authenticated/event/${rest.event_id}/slots`);
  return { success: true, data: slot };
}

export async function updateEventSlot(id: number, data: any) {
  await checkSuperAdmin();
  
  const { date, start_time, end_time, ...rest } = EventSlotSchema.parse(data);
  
  const start = data.exact_start ? new Date(data.exact_start) : new Date(date);
  if (!data.exact_start) {
    const [startH, startM] = start_time.split(":").map(Number);
    start.setHours(startH, startM, 0, 0);
  }

  const end = data.exact_end ? new Date(data.exact_end) : new Date(date);
  if (!data.exact_end) {
    const [endH, endM] = end_time.split(":").map(Number);
    end.setHours(endH, endM, 0, 0);
  }

  const slot = await prisma.eventSlot.update({
    where: { id },
    data: {
      ...rest,
      date: data.exact_start ? new Date(data.exact_start) : date,
      start_time: start,
      end_time: end,
    },
  });

  revalidatePath(`/authenticated/event/${rest.event_id}/slots`);
  return { success: true, data: slot };
}

export async function deleteEventSlot(id: number, eventId: number) {
  await checkSuperAdmin();

  await prisma.eventSlot.delete({
    where: { id },
  });

  revalidatePath(`/authenticated/event/${eventId}/slots`);
  return { success: true };
}
