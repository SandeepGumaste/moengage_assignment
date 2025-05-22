'use client';

import { Metadata } from 'next';
import ProtectedRoute from '@/components/custom/auth/ProtectedRoute';


export default function ListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
