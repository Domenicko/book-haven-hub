import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2, ExternalLink, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface WorkData {
  title: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
}

async function fetchWork(workId: string): Promise<WorkData> {
  const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
  if (!res.ok) throw new Error("Failed to fetch book details");
  return res.json();
}

function getDescription(desc?: string | { value: string }): string | null {
  if (!desc) return null;
  return typeof desc === "string" ? desc : desc.value;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { author?: string; coverId?: number; year?: number } | null;

  const { data: work, isLoading, isError } = useQuery({
    queryKey: ["work", id],
    queryFn: () => fetchWork(id!),
    enabled: !!id,
  });

  const coverId = work?.covers?.[0] ?? state?.coverId;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;
  const description = work ? getDescription(work.description) : null;
  const subjects = work?.subjects?.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-body">Loading book details...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-24">
            <p className="text-xl font-display text-foreground mb-2">Could not load book</p>
            <p className="text-muted-foreground font-body">
              Something went wrong. Please try again later.
            </p>
          </div>
        )}

        {work && (
          <div className="grid md:grid-cols-[280px_1fr] gap-10 lg:gap-14">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto md:mx-0"
            >
              <div className="w-[240px] sm:w-[280px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-foreground/10 border border-border bg-muted flex items-center justify-center">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={work.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-2">
                {work.title}
              </h1>

              {state?.author && (
                <p className="text-lg text-muted-foreground font-body mb-1">
                  by {state.author}
                </p>
              )}

              {state?.year && (
                <p className="text-sm text-muted-foreground/70 font-body mb-6">
                  First published {state.year}
                </p>
              )}

              {description && (
                <p className="text-foreground/80 font-body leading-relaxed text-base mb-6 whitespace-pre-line">
                  {description}
                </p>
              )}

              {subjects.length > 0 && (
                <div>
                  <h2 className="text-sm font-body font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Subjects
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((s) => (
                      <Badge key={s} variant="secondary" className="font-body text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
