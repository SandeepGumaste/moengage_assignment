
import { Metadata } from 'next';
import ProtectedRoute from '@/components/custom/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Saved Lists - HTTP Status Code Search',
  description: 'View your saved HTTP status code lists',
};

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
