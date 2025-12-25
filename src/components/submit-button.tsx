import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function SubmitButton({
  isLoading,
  label,
  form,
  className,
}: {
  label?: string;
  isLoading: boolean;
  form?: string | undefined;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={`${cn(className)}`}
      form={form}
    >
      {isLoading && <Loader2 className="animate-spin" />}

      {label ? label : "Loading"}
    </Button>
  );
}
