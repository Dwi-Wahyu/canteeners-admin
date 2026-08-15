"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateShopViolationForm } from "./create-shop-violation-form";

interface CreateShopViolationDialogProps {
  shopId: string;
  adminUserId: string;
}

export function CreateShopViolationDialog({
  shopId,
  adminUserId,
}: CreateShopViolationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Catat Pelanggaran
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Pelanggaran Kedai</DialogTitle>
        </DialogHeader>
        <CreateShopViolationForm
          shopId={shopId}
          adminUserId={adminUserId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
