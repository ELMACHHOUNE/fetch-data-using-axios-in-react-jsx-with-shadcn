import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditUserDialog({
  open,
  onOpenChange,
  form,
  onFieldChange,
  onSave,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSave();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update the user details below. Changes are saved locally only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First name
            </label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(event) => onFieldChange("firstName", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(event) => onFieldChange("lastName", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="age" className="text-sm font-medium">
              Age
            </label>
            <Input
              id="age"
              type="number"
              min={1}
              value={form.age}
              onChange={(event) => onFieldChange("age", event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <Select
              value={form.gender}
              onValueChange={(value) => onFieldChange("gender", value)}
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
