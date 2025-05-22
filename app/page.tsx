'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/custom/auth/AuthForm";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/search');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border rounded-lg shadow bg-white">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold pb-4">Welcome to HTTP Dogs</h1>
                <AuthForm />
            </div>
        </div>
    );
}
