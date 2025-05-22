import React, { useMemo } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchResultView = () => {
    const { results } = useSearch();

    const memoizedResults = useMemo(() => {
        return results.map(result => (
            <Card
                key={result.code} 
                className={cn(
                    "relative group overflow-hidden",
                    "transition-transform duration-200 hover:scale-105"
                )}
            >
                <CardHeader className='pb-0'>
                    <CardTitle> Code: {result.code}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 min-w-56 md:min-w-64 lg:min-w-80">
                    <div className="relative w-full h-48 md:h-64 lg:h-72">
                        <Image
                            src={result.url}
                            alt={`Status code ${result.code}`}
                            fill
                            loading="lazy"
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSUuJSEwMS85MDAwLzM0Njs7NjM4ODk5QkJCOVhXWVdLS0tNUlNBUkFLS0v/2wBDAREXFyMeHiMxMSNLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                    </div>
                </CardContent>
            </Card>
        ));
    }, [results]);

    if (results.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-8">
                No results found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4 max-w-screen-xl">
            {memoizedResults}
        </div>
    );
};

export default React.memo(SearchResultView);