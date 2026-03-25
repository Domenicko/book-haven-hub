import { useState, useMemo } from "react";
import { books } from "@/data/books";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { Badge } from "@/components/ui/badge";

const genres = Array.from(new Set(books.map((b) => b.genre))).sort();

export default function Index() {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return books.filter((b) => {
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      const matchesGenre = !selectedGenre || b.genre === selectedGenre;
      return matchesQuery && matchesGenre;
    });
  }, [query, selectedGenre]);

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
          Browse our curated collection of books across every genre. Find stories that move you.
        </p>
        <div className="flex justify-center">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Genre Filters */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedGenre(null)}
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
              onClick={() => setSelectedGenre(selectedGenre === g ? null : g)}
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
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground font-body mb-6">
              {filtered.length} book{filtered.length !== 1 && "s"} found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {filtered.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-display text-foreground mb-2">No books found</p>
            <p className="text-muted-foreground font-body">
              Try a different search term or genre filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
