'use client';

import { UserProvider } from "@/contexts/UserContext";
import { SearchProvider } from "@/contexts/SearchContext";
import Navbar from "@/components/custom/navbar/Navbar";
import { usePathname } from "next/navigation";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/";

  return (
    <UserProvider>
      <SearchProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar hide={hideNavbar} />
          <main className="pt-20 px-4">
            {children}
          </main>
        </div>
      </SearchProvider>
    </UserProvider>
  );
}
