'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';

type SavedListData = {
  _id: string;
  name: string;
  email: string;
  creationDate: string | Date;
  responseCodes: string[];
  imageUrls: string[];
};

interface ListViewModalProps {
  list: SavedListData;
  onClose: () => void;
  onDeleteImage: (index: number) => Promise<void>;
}

export default function ListViewModal({ list, onClose, onDeleteImage }: ListViewModalProps) {
  const [localImages, setLocalImages] = useState<string[]>(list.imageUrls);
  const [localCodes, setLocalCodes] = useState<string[]>(list.responseCodes);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleDelete = async (index: number) => {
    setDeletingIndex(index);
    try {
      await onDeleteImage(index);
      setLocalImages(prev => prev.filter((_, i) => i !== index));
      setLocalCodes(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [handleEscape]);

  return createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{list.name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-muted-foreground">Status Codes: {localCodes.join(', ')}</p>
            <p className="text-muted-foreground">Created: {new Date(list.creationDate).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localImages.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <div className="relative w-full h-full">
                  <Image
                    src={url}
                    alt={`Status code ${localCodes[index]}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold mb-2">
                    Status Code: {localCodes[index]}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    disabled={deletingIndex === index}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingIndex === index ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}
