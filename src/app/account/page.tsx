"use client";

import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must log in first.</p>;

  return (
    <div>
      <h1>Account</h1>
      <p>Welcome, {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  );
}
