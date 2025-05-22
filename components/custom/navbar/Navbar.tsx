"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

type Props = { hide: boolean };

const Navbar = ({ hide }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();

  if (hide) return null;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    router.replace("/welcome");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">HTTP Dogs</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              asChild
              variant={pathname === "/search" ? "default" : "outline"}
            >
              <Link href="/search">Search</Link>
            </Button>            <Button
              asChild
              variant={pathname === "/lists" ? "default" : "outline"}
            >
              <Link href="/lists">Lists</Link>
            </Button>
            {user && (
              <>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;