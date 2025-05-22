'use client';

import Navbar from '@/components/custom/navbar/Navbar';

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar hide={false} />
            <main className="pt-20 px-4">
                {children}
            </main>
        </div>
    );
}