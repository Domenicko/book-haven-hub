import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-destructive fill-destructive" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Your Favorites
          </h1>
          {favorites.length > 0 && (
            <span className="text-sm text-muted-foreground font-body">
              ({favorites.length} book{favorites.length !== 1 && "s"})
            </span>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {favorites.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-xl font-display text-foreground mb-2">No favorites yet</p>
            <p className="text-muted-foreground font-body mb-6">
              Search for books and click the heart icon to save them here.
            </p>
            <Button asChild>
              <Link to="/">Browse Books</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
