import { useState, useCallback } from 'react';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; text: string; score?: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      // TODO: Implement BM25 search with minisearch worker
      // For now, simple text matching against document chunks
      const { db } = await import('../db/schema');
      const allChunks = await db.documentChunks.toArray();
      
      const results = allChunks
        .filter(chunk => 
          chunk.text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 20)
        .map(chunk => ({
          id: chunk.id,
          text: chunk.text.substring(0, 200) + (chunk.text.length > 200 ? '...' : ''),
          sourceDocId: chunk.sourceDocId,
        }));

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
  };
};
