import { PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

function EditButton({ className, children = "Éditer", ...props }) {
  return (
    <Button variant="outline" size="sm" className={className} {...props}>
      <PencilLine className="h-4 w-4" />
      <span>{children}</span>
    </Button>
  );
}

function DeleteButton({ className, children = "Supprimer", ...props }) {
  return (
    <Button
      variant="destructive"
      size="sm"
      className={className}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
      <span>{children}</span>
    </Button>
  );
}

export { EditButton, DeleteButton };