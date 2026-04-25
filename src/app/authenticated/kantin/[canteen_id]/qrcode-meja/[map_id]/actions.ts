"use server";

import QRCode from "qrcode";
import { ServerActionReturn } from "@/types/server-action";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LocalStorageService } from "@/services/storage";

export async function createNewTableQRCode({
  previousTableNumber,
  canteen_id,
  canteen_slug,
  map_id,
  floor,
}: {
  previousTableNumber: number;
  canteen_id: number;
  canteen_slug: string;
  map_id: number;
  floor: number;
}): Promise<ServerActionReturn<void>> {
  try {
    const storageService = new LocalStorageService();
    const params = new URLSearchParams();

    const nextTableNumber = previousTableNumber + 1;

    params.set("floor", floor.toString());
    params.set("table_number", nextTableNumber.toString());

    const fullUrl = `${process.env.NEXT_PUBLIC_MAIN_URL}/kantin/${canteen_slug}?${params.toString()}`;

    // Generate QR Code Buffer
    const qrBuffer = await QRCode.toBuffer(fullUrl, {
      errorCorrectionLevel: "M",
      type: "png",
      margin: 1,
      color: {
        dark: "#fff",
        light: "#000",
      },
    });

    // Create File object from Buffer to be uploaded
    const file = new File(
      [new Uint8Array(qrBuffer)],
      `qrcode-${nextTableNumber}.png`,
      {
        type: "image/png",
      },
    );

    // Upload to storage service
    const filename = await storageService.uploadImage(file, "table-qrcode");

    await prisma.$transaction(async (tx) => {
      // Create the QR Code entry
      await tx.tableQRCode.create({
        data: {
          floor,
          image_url: filename,
          table_number: nextTableNumber,
          canteen_id,
          map_id,
        },
      });

      // Increment table_count in CanteenMap
      await tx.canteenMap.update({
        where: { id: map_id },
        data: {
          table_count: {
            increment: 1,
          },
        },
      });
    });

    revalidatePath(`/authenticated/kantin/${canteen_id}/qrcode-meja/${map_id}`);

    return successResponse(undefined, "Berhasil generate QR Code");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function deleteTableQRCode({
  id,
  image_url,
  canteen_id,
  map_id,
}: {
  id: number;
  image_url: string;
  canteen_id: number;
  map_id: number;
}): Promise<ServerActionReturn<void>> {
  try {
    const storageService = new LocalStorageService();

    await prisma.$transaction(async (tx) => {
      // Delete the QR Code entry
      await tx.tableQRCode.delete({
        where: { id },
      });

      // Decrement table_count in CanteenMap
      await tx.canteenMap.update({
        where: { id: map_id },
        data: {
          table_count: {
            decrement: 1,
          },
        },
      });
    });

    // Delete from storage service
    await storageService.deleteFile(image_url, "table-qrcode");

    revalidatePath(`/authenticated/kantin/${canteen_id}/qrcode-meja/${map_id}`);

    return successResponse(undefined, "Berhasil menghapus QR Code");
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan saat menghapus QR Code");
  }
}
