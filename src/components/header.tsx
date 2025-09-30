"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUser } from "react-icons/fa"; // user icon
import "../styles/components/header.css";

function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">StringCompass</Link>
      </div>
      <nav className="nav">
        <Link href="/luthiers">Luthiers</Link>
        <Link href="/instruments">Instruments</Link>
        <Link href="/about">About</Link>
        {/*} <Link href="/auth" className="auth-link">
          <FaUser size={18} /> {/* small user icon }
        </Link> */}
        {/* Is Account when logged in, is icon when you want to register/login */}
        {status === "authenticated" ? (
          <>
            <Link href="/account" className="auth-link">
              <FaUser size={18} />
              <span>{session?.user?.name ?? "Mijn account"}</span>
            </Link>
            <button
              className="logout-btn"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth" className="auth-link">
            <FaUser size={18} />
            <span>Log in</span>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
