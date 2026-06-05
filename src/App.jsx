import { useCallback, useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

import DataTable from "./components/DataTable";
import EditUserDialog from "./components/EditUserDialog";
import { Button } from "./components/ui/button";

const columnHelper = createColumnHelper();

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const apiBase = import.meta.env.VITE_FAKE_API;
        const res = await axios.get(`${apiBase}/users`);

        if (isMounted) {
          setUsers(res.data?.users ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message ?? "Something went wrong");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setDialogOpen(true);
  }, []);

  const handleSaved = useCallback((updated) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
    );
  }, []);

  const handleDelete = useCallback(async (user) => {
    if (!confirm(`Delete user ${user.firstName} ${user.lastName}?`)) return;
    try {
      const apiBase = import.meta.env.VITE_FAKE_API;
      await axios.delete(`${apiBase}/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      alert(`User ${user.id} deleted successfully`);
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    }
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("firstName", {
        header: "First name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lastName", {
        header: "Last name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("age", {
        header: "Age",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("gender", {
        header: "Gender",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
              title="Edit"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row.original)}
              title="Delete"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [handleEdit, handleDelete],
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          DummyJSON Users
        </h1>
        <p className="text-sm text-muted-foreground">
          A shadcn/ui table powered by TanStack Table and populated from the
          DummyJSON API.
        </p>
      </header>

      {loading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          Loading users...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}

      <EditUserDialog
        user={editingUser}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        onSaved={handleSaved}
      />
    </main>
  );
}
