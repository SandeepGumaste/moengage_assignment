"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SavedList {
  _id: string;
  name: string;
  email: string;
  creationDate: string;
  responseCodes: string[];
  imageUrls: string[];
}

export default function SavedLists() {
  const [lists, setLists] = useState<SavedList[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/saved-lists', {
          headers: {
            'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch lists');
        }

        const data = await response.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [router]);

  const handleView = (list: SavedList) => {
    router.push(`/search?q=${list.responseCodes[0]}`);
  };

  const handleEdit = (list: SavedList) => {
    console.log('Edit list:', list);
  };

  const handleDelete = async (list: SavedList) => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }

    try {
      setDeleting(list._id);
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch(`/api/saved-lists?id=${list._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/');
          return;
        }
        throw new Error('Failed to delete list');
      }

      // Update local state to remove the deleted list
      setLists(lists => lists.filter(l => l._id !== list._id));
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Lists</h1>
      {lists.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No saved lists found. Go to the search page to create one!</p>
          <Button
            variant="outline"
            size="default"
            className="mt-4"
            onClick={() => router.push('/search')}
          >
            Go to Search
          </Button>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lists.map((list) => (
                  <TableRow key={list._id}>
                    <TableCell>{list.name}</TableCell>
                    <TableCell>
                      {new Date(list.creationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(list)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(list)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(list)}
                          disabled={deleting === list._id}
                        >
                          {deleting === list._id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
