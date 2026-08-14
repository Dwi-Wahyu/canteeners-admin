import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { EventSlotSearchParamsInput } from "../types/event-slot-search-params";

export async function getEvents() {
  return await prisma.event.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      _count: {
        select: {
          slots: true,
        },
      },
    },
  });
}

export async function getEventById(id: number) {
  return await prisma.event.findUnique({
    where: { id },
  });
}

export async function getEventSlots(
  eventId: number,
  searchParams: EventSlotSearchParamsInput,
) {
  const where: Prisma.EventSlotWhereInput = {
    event_id: eventId,
  };

  if (searchParams.date && searchParams.date.length > 0) {
    if (searchParams.date.length === 2) {
      const [from, to] = searchParams.date.map(Number);
      if (!isNaN(from) && !isNaN(to)) {
        const startDate = new Date(from);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        where.date = {
          gte: startDate,
          lte: endDate,
        };
      }
    } else {
      const date = Number(searchParams.date[0]);
      if (!isNaN(date)) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        where.date = {
          gte: startDate,
          lte: endDate,
        };
      }
    }
  }

  const [data, total] = await Promise.all([
    prisma.eventSlot.findMany({
      where,
      take: searchParams.perPage,
      skip: (searchParams.page - 1) * searchParams.perPage,
      orderBy: {
        date: "asc",
      },
    }),
    prisma.eventSlot.count({ where }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / searchParams.perPage),
    total,
  };
}

export async function getEventSlotById(id: number) {
  return await prisma.eventSlot.findUnique({
    where: { id },
    include: {
      event: true,
    },
  });
}
