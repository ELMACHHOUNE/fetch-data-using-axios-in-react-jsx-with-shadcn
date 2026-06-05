import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import DataTable from "./components/DataTable";
import EditUserDialog from "./components/data-table/edit-user-dialog";
import { Button } from "./components/ui/button";

const columnHelper = createColumnHelper();

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
  });

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
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      age: String(user.age),
      gender: user.gender,
      email: user.email,
    });
  }, []);

  const handleDelete = useCallback((user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              firstName: editForm.firstName,
              lastName: editForm.lastName,
              age: Number(editForm.age),
              gender: editForm.gender,
              email: editForm.email,
            }
          : u,
      ),
    );
    setEditingUser(null);
  }, [editingUser, editForm]);

  const handleDialogOpenChange = useCallback((open) => {
    if (!open) setEditingUser(null);
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
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(info.row.original)}
              aria-label={`Modifier l'utilisateur ${info.row.original.firstName} ${info.row.original.lastName}`}
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(info.row.original)}
              aria-label={`Supprimer l'utilisateur ${info.row.original.firstName} ${info.row.original.lastName}`}
            >
              <TrashIcon className="h-4 w-4" />
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
        open={editingUser !== null}
        onOpenChange={handleDialogOpenChange}
        form={editForm}
        onFieldChange={handleFieldChange}
        onSave={handleSaveEdit}
      />
    </main>
  );
}
