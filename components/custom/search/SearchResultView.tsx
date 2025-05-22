import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 p-4 max-w-screen-xl ">
            {results.map((result, index) => (
                <Card
                    key={index}
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
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default SearchResultView;