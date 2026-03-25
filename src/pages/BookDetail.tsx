import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Header from "@/components/Header";

export default function BookDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Book Details</h1>
        <p className="text-muted-foreground font-body mb-6">
          Detailed view for book <code className="text-primary">{id}</code> coming soon.
        </p>
        <Link to="/" className="text-primary hover:underline font-body">
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
