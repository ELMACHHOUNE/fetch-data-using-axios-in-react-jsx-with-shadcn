import { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";

import DataTable from "./components/DataTable";
import { Button } from "./components/ui/button";

const columnHelper = createColumnHelper();

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function handleEdit(user) {
    const firstName = window.prompt("First name", user.firstName);
    if (firstName === null) return;

    const lastName = window.prompt("Last name", user.lastName);
    if (lastName === null) return;

    const email = window.prompt("Email", user.email);
    if (email === null) return;

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? {
              ...currentUser,
              firstName,
              lastName,
              email,
            }
          : currentUser,
      ),
    );
  }

  function handleDelete(user) {
    const isConfirmed = window.confirm(
      `Supprimer ${user.firstName} ${user.lastName} ?`,
    );

    if (!isConfirmed) return;

    setUsers((currentUsers) =>
      currentUsers.filter((currentUser) => currentUser.id !== user.id),
    );
  }

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
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = String(user.email ?? "").toLowerCase();
      const gender = String(user.gender ?? "").toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        gender.includes(query)
      );
    });
  }, [users, searchQuery]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchQuery(searchInput);
  }

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

      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Rechercher par nom, email ou genre"
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring sm:max-w-sm"
        />
        <Button type="submit" size="sm">
          Rechercher
        </Button>
      </form>

      {loading ? (
        <div className="rounded-md border p-6 text-sm text-muted-foreground">
          Loading users...
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
