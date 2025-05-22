import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const SearchResultView = () => {
  const { results } = useSearch();

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No results found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {results.map((result, index) => (
        <Card 
          key={index}
          className={cn(
            "relative group overflow-hidden",
            "transition-transform duration-200 hover:scale-105"
          )}
        >
          <CardContent className="p-0">
            <div className="aspect-square relative">
              <Image
                src={result.url}
                alt={`Status code ${result.code}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="p-3 bg-white/90 absolute bottom-0 w-full">
                <p className="text-sm font-medium text-gray-900">
                  Status Code: {result.code}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResultView;