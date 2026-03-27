import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface BookCardBook {
  id: string;
  title: string;
  author: string;
  year?: number;
  cover?: string;
  coverId?: number;
}

interface BookCardProps {
  book: BookCardBook;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  const workId = book.id.replace("/works/", "");
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(book.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(book);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.6), duration: 0.4, ease: "easeOut" }}
    >
      <Link
        to={`/book/${workId}`}
        state={{ author: book.author, coverId: book.coverId, year: book.year }}
        className="group block rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 hover:border-primary/20"
      >
        <div className="aspect-[2/3] overflow-hidden bg-muted flex items-center justify-center relative">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <BookOpen className="h-10 w-10 text-muted-foreground/40 transition-colors group-hover:text-primary/40" />
          )}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favorited ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>
        <div className="p-3.5 sm:p-4 space-y-1">
          <h3 className="font-display font-semibold text-sm sm:text-base text-foreground leading-snug line-clamp-1 transition-colors duration-200 group-hover:text-primary">
            {book.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-body line-clamp-1">{book.author}</p>
          {book.year && (
            <p className="text-xs text-muted-foreground/60 font-body">{book.year}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
