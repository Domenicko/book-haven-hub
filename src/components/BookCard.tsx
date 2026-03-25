import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface BookCardBook {
  id: string;
  title: string;
  author: string;
  year?: number;
  cover?: string;
}

interface BookCardProps {
  book: BookCardBook;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.4 }}
    >
      <div className="group block rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
        <div className="aspect-[2/3] overflow-hidden bg-muted flex items-center justify-center">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          )}
        </div>
        <div className="p-4 space-y-1.5">
          <h3 className="font-display font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground font-body line-clamp-1">{book.author}</p>
          {book.year && (
            <p className="text-xs text-muted-foreground/70 font-body">{book.year}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
