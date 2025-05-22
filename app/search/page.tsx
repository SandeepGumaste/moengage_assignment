'use client';

import SearchBar from '@/components/custom/search/SearchBar'
import SearchResultView from '@/components/custom/search/SearchResultView'
import { SearchProvider } from '@/contexts/SearchContext';

const SearchPage = () => {
  return (
    <SearchProvider>
      <div className="space-y-6">
        <SearchBar />
        <SearchResultView />
      </div>
    </SearchProvider>
  )
}

export default SearchPage