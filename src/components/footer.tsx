"use client";

import Link from "next/link";
import "../styles/components/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="/luthiers">Luthiers</Link>
        <Link href="/instruments">Instruments</Link>
        <Link href="/about">About</Link>
      </div>
      <p>© {new Date().getFullYear()} StringCompass</p>
    </footer>
  );
}

export default Footer;
