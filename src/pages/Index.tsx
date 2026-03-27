import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 24;

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface SearchResult {
  docs: OpenLibraryBook[];
  numFound: number;
}

async function searchBooks(query: string, page: number): Promise<SearchResult> {
  if (!query.trim()) return { docs: [], numFound: 0 };
  const offset = (page - 1) * PAGE_SIZE;
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return { docs: data.docs ?? [], numFound: data.numFound ?? 0 };
}

const genres = ["Fiction", "Science Fiction", "Mystery", "Non-Fiction", "Self-Help", "History", "Fantasy", "Romance"];

export default function Index() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["books", query, page],
    queryFn: () => searchBooks(query, page),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const books = data?.docs ?? [];
  const totalResults = data?.numFound ?? 0;
  const totalPages = Math.min(Math.ceil(totalResults / PAGE_SIZE), 50);
  const searchActive = query.trim().length > 0;

  const handleGenreClick = (genre: string | null) => {
    setSelectedGenre(genre);
    setQuery(genre ?? "");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch searchValue={query} onSearchChange={handleSearchChange} />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 sm:pt-16 pb-10 sm:pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-4">
          Discover your next<br />
          <span className="text-primary italic">great read</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground font-body max-w-lg mx-auto mb-8">
          Search millions of books from Open Library. Find stories that move you.
        </p>
        <div className="flex justify-center md:hidden">
          <SearchBar value={query} onChange={handleSearchChange} />
        </div>
      </section>

      {/* Genre Quick Filters */}
      <section className="container mx-auto px-4 pb-6 sm:pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleGenreClick(null)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
              !selectedGenre
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
            }`}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => handleGenreClick(selectedGenre === g ? null : g)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                selectedGenre === g
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading || isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-body">Searching books...</p>
          </div>
        ) : searchActive && books.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground font-body mb-6">
              {totalResults.toLocaleString()} book{totalResults !== 1 && "s"} found — page {page} of {totalPages}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {books.map((book, i) => (
                <BookCard
                  key={book.key}
                  book={{
                    id: book.key,
                    title: book.title,
                    author: book.author_name?.[0] ?? "Unknown author",
                    year: book.first_publish_year,
                    coverId: book.cover_i,
                    cover: book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : undefined,
                  }}
                  index={i}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {getVisiblePages().map((p, idx) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : searchActive && books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-display text-foreground mb-2">No books found</p>
            <p className="text-muted-foreground font-body">
              Try a different search term or genre.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-display text-foreground mb-2">Start searching</p>
            <p className="text-muted-foreground font-body">
              Type a title, author, or keyword above to explore millions of books.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
