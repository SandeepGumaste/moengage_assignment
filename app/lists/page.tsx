"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ListViewModal from '@/components/custom/modals/ListViewModal';

type SavedList = {
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
  const [selectedList, setSelectedList] = useState<SavedList | null>(null);
  const router = useRouter();
  const { user } = useUser();

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
        }        const data = await response.json();
        setLists(data.filter((list: SavedList) => list.email === user?.email));
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        setLoading(false);
      }
    };    fetchLists();
  }, [router, user?.email]);

  const handleView = (list: SavedList) => {
    setSelectedList(list);
  };


  const handleDelete = async (list: SavedList) => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }

    try {      setDeleting(list.name);
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }      const response = await fetch(`/api/saved-lists?name=${encodeURIComponent(list.name)}&email=${encodeURIComponent(list.email)}`, {
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
      setLists(lists => lists.filter(l => !(l.name === list.name && l.email === list.email)));
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list');
    } finally {
      setDeleting(null);
    }
  };  const handleDeleteImage = async (listId: string, imageIndex: number): Promise<void> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }    const list = lists.find(l => l._id === listId);
    if (!list) return;

    if (list.imageUrls.length === 1) {
      const confirmed = window.confirm('This is the last image in the list. Do you want to delete the entire list?');
      if (confirmed) {
        await handleDelete(list);
        setSelectedList(null); 
      }else{
         setSelectedList(null); 
      }
      return;
    }

    const newImages = [...list.imageUrls];
    const newCodes = [...list.responseCodes];
    newImages.splice(imageIndex, 1);
    newCodes.splice(imageIndex, 1);

    try {
      const response = await fetch('/api/saved-lists', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.replace(/^Bearer\s+/i, '')}`
        },
        body: JSON.stringify({
          listId,
          imageUrls: newImages,
          responseCodes: newCodes
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/');
          return;
        }
        throw new Error('Failed to update list');
      }

      setLists(currentLists => 
        currentLists.map(l => {
          if (l._id === listId) {
            return { ...l, imageUrls: newImages, responseCodes: newCodes };
          }
          return l;
        })
      );
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error; 
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
                          View / Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(list)}
                          disabled={deleting === list.name}
                        >
                          {deleting === list.name ? 'Deleting...' : 'Delete'}
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
      
      {selectedList && (
        <ListViewModal
          list={selectedList}
          onClose={() => setSelectedList(null)}
          onDeleteImage={(index) => handleDeleteImage(selectedList._id, index)}
        />
      )}
    </div>
  );
}
