import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

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
        <div className="aspect-[2/3] overflow-hidden bg-muted flex items-center justify-center">
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
