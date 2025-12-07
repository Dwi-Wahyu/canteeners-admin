import { Loader } from "lucide-react";
import { Button } from "./ui/button";

export default function SubmitButton({
  isLoading,
  label,
  form,
}: {
  label?: string;
  isLoading: boolean;
  form?: string | undefined;
}) {
  return (
    <Button type="submit" disabled={isLoading} form={form}>
      {isLoading && <Loader className="animate-spin" />}

      {label ? label : "Loading"}
    </Button>
  );
}
