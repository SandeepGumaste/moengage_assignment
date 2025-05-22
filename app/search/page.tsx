'use client';

import SearchBar from '@/components/custom/search/SearchBar'
import { SearchProvider } from '@/contexts/SearchContext';

const SearchPage = () => {
  return (
    <SearchProvider>
      <SearchBar />
    </SearchProvider>
  )
}

export default SearchPage