import { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";

import DataTable from "./components/DataTable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper();

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const apiBase = import.meta.env.VITE_DUMMYJSON_API;
        const res = await axios.get(`${apiBase}/users?limit=20`);

        if (isMounted) {
          setUsers(res.data?.users ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message ?? "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleEdit = (user) => {
    alert(`Edit ${user.firstName} ${user.lastName}`);
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
      }),

      columnHelper.accessor("firstName", {
        header: "First name",
      }),

      columnHelper.accessor("lastName", {
        header: "Last name",
      }),

      columnHelper.accessor("age", {
        header: "Age",
      }),

      columnHelper.accessor("gender", {
        header: "Gender",
      }),

      columnHelper.accessor("email", {
        header: "Email",
      }),

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [users]
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

      <Input
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          Loading users...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} data={filteredUsers} />
      )}
    </main>
  );
}