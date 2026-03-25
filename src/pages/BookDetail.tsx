import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingCart, BookOpen } from "lucide-react";
import { books } from "@/data/books";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function BookDetail() {
  const { id } = useParams();
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">Book not found</h1>
          <Link to="/" className="text-primary hover:underline font-body">
            ← Back to collection
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`"${book.title}" added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to collection
        </Link>

        <div className="grid md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr] gap-10 lg:gap-16">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-foreground/10 border border-border">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <Badge variant="secondary" className="w-fit mb-3 font-body">
              {book.genre}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-muted-foreground font-body mb-4">
              by {book.author}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-1.5 text-accent font-body font-medium">
                <Star className="h-5 w-5 fill-accent" />
                {book.rating} / 5
              </span>
              <span className="text-muted-foreground font-body">·</span>
              <span className="text-muted-foreground font-body">{book.pages} pages</span>
              <span className="text-muted-foreground font-body">·</span>
              <span className="text-muted-foreground font-body">{book.year}</span>
            </div>

            <p className="text-foreground/80 font-body leading-relaxed text-base mb-8 max-w-2xl">
              {book.description}
            </p>

            <div className="flex items-end gap-4 mt-auto">
              <div>
                <p className="text-sm text-muted-foreground font-body mb-1">Price</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  ${book.price.toFixed(2)}
                </p>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground font-body">
                ISBN: {book.isbn}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
