'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/custom/auth/AuthForm";

export default function WelcomePage() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border rounded-lg shadow bg-white">
            
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold pb-4">Welcome to HTTP Dogs</h1>
                <AuthForm />
            </div>
        </div>
    );
}
