import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { Loader2 } from "lucide-react";

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

async function searchBooks(query: string): Promise<OpenLibraryBook[]> {
  if (!query.trim()) return [];
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=30`);
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return data.docs ?? [];
}

const genres = ["Fiction", "Science Fiction", "Mystery", "Non-Fiction", "Self-Help", "History", "Fantasy", "Romance"];

export default function Index() {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: results, isLoading, isFetching } = useQuery({
    queryKey: ["books", query],
    queryFn: () => searchBooks(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const searchActive = query.trim().length > 0;

  const handleGenreClick = (genre: string | null) => {
    setSelectedGenre(genre);
    if (genre) {
      setQuery(genre);
    } else {
      setQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-4">
          Discover your next<br />
          <span className="text-primary italic">great read</span>
        </h1>
        <p className="text-lg text-muted-foreground font-body max-w-lg mx-auto mb-8">
          Search millions of books from Open Library. Find stories that move you.
        </p>
        <div className="flex justify-center">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Genre Quick Filters */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleGenreClick(null)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
              !selectedGenre
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => handleGenreClick(selectedGenre === g ? null : g)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
                selectedGenre === g
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
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
        ) : searchActive && results && results.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground font-body mb-6">
              {results.length} book{results.length !== 1 && "s"} found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {results.map((book, i) => (
                <BookCard
                  key={book.key}
                  book={{
                    id: book.key,
                    title: book.title,
                    author: book.author_name?.[0] ?? "Unknown author",
                    year: book.first_publish_year,
                    cover: book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : undefined,
                  }}
                  index={i}
                />
              ))}
            </div>
          </>
        ) : searchActive && results && results.length === 0 ? (
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
