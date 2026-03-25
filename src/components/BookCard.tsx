import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Book } from "@/data/books";

interface BookCardProps {
  book: Book;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/book/${book.id}`}
        className="group block rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5"
      >
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-1.5">
          <h3 className="font-display font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground font-body">{book.author}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-semibold text-foreground font-body">
              ${book.price.toFixed(2)}
            </span>
            <span className="flex items-center gap-1 text-sm text-accent font-body">
              <Star className="h-3.5 w-3.5 fill-accent" />
              {book.rating}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
