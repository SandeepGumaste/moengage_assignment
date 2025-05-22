'use client';

import Navbar from '@/components/custom/navbar/Navbar';
import ProtectedRoute from '@/components/custom/auth/ProtectedRoute';

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Navbar hide={false} />
                <main className="pt-20 px-4">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}