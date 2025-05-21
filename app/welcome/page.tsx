'use client';

import AuthForm from "@/components/custom/auth/AuthForm";

export default function WelcomePage() {

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border rounded-lg shadow bg-white">
            
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold pb-4">Welcome to HTTP Dogs</h1>
                <AuthForm />
            </div>
        </div>
    );
}
