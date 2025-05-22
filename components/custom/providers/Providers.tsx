'use client';

import { UserProvider } from "@/contexts/UserContext";
import { SearchProvider } from "@/contexts/SearchContext";
import Navbar from "@/components/custom/navbar/Navbar";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/";

  return (
    <UserProvider>
      <SearchProvider>
        <Navbar hide={hideNavbar} />
        {children}
      </SearchProvider>
    </UserProvider>
  );
}
