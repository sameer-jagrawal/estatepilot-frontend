import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
