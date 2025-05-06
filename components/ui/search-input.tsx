'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { Search } from 'lucide-react';
import { type FormEvent, useEffect, useState, useCallback } from 'react';

const KEY_SEARCH = 'search';

type SearchInputProps = { 
  lengthData: number; 
  urlBack: string; 
  urlAction?: string;
  onSearchChange?: (searchTerm: string) => void;
  placeholder?: string;
};

export const SearchInput = ({ 
  lengthData, 
  urlBack, 
  urlAction = '', 
  onSearchChange,
  placeholder = "Recherche..." 
}: SearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const queryData = searchParams?.get(KEY_SEARCH) || '';
  const defaultSearchState = queryData.length > 0;
  const noData = lengthData > 0;

  const [searchTerm, setSearchTerm] = useState<string>(queryData);
  const [hasSearch, setHasSearch] = useState<boolean>(defaultSearchState);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(queryData);
  }, [queryData]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, [onSearchChange]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    // Create URL with search params
    const url = new URL(urlAction || window.location.href, window.location.origin);
    
    // Clear existing search params and set the new one
    const params = new URLSearchParams(url.search);
    if (searchTerm) {
      params.set(KEY_SEARCH, searchTerm);
    } else {
      params.delete(KEY_SEARCH);
    }
    
    // Update URL
    const newUrl = `${url.pathname}?${params.toString()}`;
    
    // Navigate to the new URL
    router.push(newUrl);
    
    setHasSearch(!!searchTerm);
    setIsDialogOpen(false);
    setIsProcessing(false);
  };

  const SearchForm = () => (
    <form method="get" action="" className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full"
      />
      <Button variant="secondary" size="sm" type="submit" disabled={isProcessing}>
        {isProcessing ? <Loader /> : <Search size={15} />}
      </Button>
    </form>
  );

  const SearchResults = () =>
    hasSearch && (
      <div>
        <p className="text-muted-foreground flex items-center gap-3 text-xs">
          <span>
            {lengthData} {lengthData > 1 ? 'Résultats trouvés' : 'Résultat trouvé'} pour cette recherche.
          </span>
          <Link href={urlBack} className="hover:underline">
            Réinitialiser la recherche
          </Link>
        </p>
      </div>
    );

  if (isMobile) {
    return (
      <div className="space-y-3">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Search size={15} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Recherche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {noData ? (
                <SearchForm />
              ) : (
                <p className="flex items-center gap-3 text-xs text-indigo-500 dark:text-indigo-300">
                  Pas de données disponible
                </p>
              )}
              <SearchResults />
            </div>
          </DialogContent>
        </Dialog>

        {/* Show search results outside the modal if there's a search */}
        <div className="mt-2">
          <SearchResults />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {noData ? (
        <div className="flex items-center justify-between gap-3">
          <SearchForm />
        </div>
      ) : (
        <p className="flex items-center gap-3 text-xs text-indigo-500 dark:text-indigo-300">Pas de données disponible</p>
      )}
      <SearchResults />
    </div>
  );
};

// Hook pour utiliser le composant de recherche
export const useSearch = (initialValue: string = '') => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  return {
    searchTerm,
    handleSearchChange,
    setSearchTerm
  };
};
