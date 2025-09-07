'use client';

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathName = usePathname()
const isUserCreated = pathName==='/login'||pathName==="/signup"
  return (
    <>
    { !isUserCreated&& <Navbar />}
      <main className="min-h-screen className='bg-[#121212]'">
        {children}
      </main>
     {!isUserCreated&& <Footer />}
    </>
  );
}
