import { useCallback, useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";

import DataTable from "./components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const columnHelper = createColumnHelper();

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({});

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

  const openEdit = useCallback((user) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      email: user.email,
    });
  }, []);

  const closeEdit = useCallback(() => {
    setEditingUser(null);
    setForm({});
  }, []);

  const saveEdit = useCallback(() => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? { ...u, ...form } : u,
      ),
    );
    closeEdit();
  }, [editingUser, form, closeEdit]);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Delete this user?")) {
                  deleteUser(row.original.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        ),
      }),
    ],
    [openEdit, deleteUser],
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

      <Dialog open={!!editingUser} onClose={closeEdit}>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">First name</label>
            <Input
              value={form.firstName || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last name</label>
            <Input
              value={form.lastName || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <Input
              type="number"
              value={form.age || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, age: Number(e.target.value) }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Input
              value={form.gender || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, gender: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={form.email || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeEdit}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Dialog>
    </main>
  );
}
