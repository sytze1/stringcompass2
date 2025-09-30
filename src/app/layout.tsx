import "../styles/layout.css";
import Header from "../components/header";
import Footer from "../components/footer";
import NextAuthProvider from "../providers/sessionProvider";

export const metadata = {
  title: "StringCompass",
  description: "Discover luthiers and instruments near you",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
