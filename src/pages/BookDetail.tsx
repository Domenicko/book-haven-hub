import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2, ExternalLink, ShoppingCart, Heart } from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useFavorites } from "@/contexts/FavoritesContext";

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

async function fetchReadLink(workId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://openlibrary.org/works/${workId}/editions.json?limit=5`);
    if (!res.ok) return null;
    const data = await res.json();
    for (const entry of data.entries ?? []) {
      if (entry.ocaid) return `https://archive.org/details/${entry.ocaid}`;
    }
    return null;
  } catch {
    return null;
  }
}

function getDescription(desc?: string | { value: string }): string | null {
  if (!desc) return null;
  return typeof desc === "string" ? desc : desc.value;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { author?: string; coverId?: number; year?: number } | null;
  const [buyOpen, setBuyOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { data: work, isLoading, isError } = useQuery({
    queryKey: ["work", id],
    queryFn: () => fetchWork(id!),
    enabled: !!id,
  });

  const { data: readLink, isLoading: readLoading } = useQuery({
    queryKey: ["readLink", id],
    queryFn: () => fetchReadLink(id!),
    enabled: !!id,
  });

  const coverId = work?.covers?.[0] ?? state?.coverId;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;
  const description = work ? getDescription(work.description) : null;
  const subjects = work?.subjects?.slice(0, 8) ?? [];

  const bookId = `/works/${id}`;
  const favorited = isFavorite(bookId);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: bookId,
      title: work?.title ?? "Unknown",
      author: state?.author ?? "Unknown author",
      year: state?.year,
      coverId,
      cover: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
    });
    if (!favorited) {
      toast.success("Added to favorites");
    }
  };

  const handleBuySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Authentication required", { description: "Please log in to place an order." });
      return;
    }

    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string).trim();
    const email = (form.get("email") as string).trim();
    const phone = (form.get("phone") as string).trim();
    const address = (form.get("address") as string).trim();
    const errors: Record<string, string> = {};

    if (!name) errors.name = "Name is required";
    else if (name.length > 200) errors.name = "Name is too long";

    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
    else if (email.length > 255) errors.email = "Email is too long";

    if (!phone) errors.phone = "Phone number is required";
    else if (!/^[+\d\s()-]{7,20}$/.test(phone)) errors.phone = "Enter a valid phone number";

    if (!address) errors.address = "Address is required";
    else if (address.length > 500) errors.address = "Address is too long";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        book_title: work?.title ?? "Unknown",
        book_id: id ?? "",
        full_name: name,
        email,
        phone,
        address,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This order has already been placed.");
        }
        if (error.code === "42501") {
          throw new Error("Permission denied. Please log in again.");
        }
        throw new Error(error.message);
      }

      setBuyOpen(false);
      toast.success("Order successful", { description: `"${work?.title}" will be on its way soon.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      toast.error("Order failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  };

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
                  <img src="/placeholder.svg" alt="No cover available" className="h-20 w-20 opacity-30" />
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

              {(state?.author || "Unknown author") && (
                <p className="text-lg text-muted-foreground font-body mb-1">
                  by {state?.author || "Unknown author"}
                </p>
              )}

              {state?.year && (
                <p className="text-sm text-muted-foreground/70 font-body mb-6">
                  First published {state.year}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                {readLink ? (
                  <Button asChild>
                    <a href={readLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Read Book
                    </a>
                  </Button>
                ) : (
                  <Button disabled={!readLoading} variant="outline">
                    {readLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking…
                      </>
                    ) : (
                      "Not Available Online"
                    )}
                  </Button>
                )}

                <Button variant="secondary" onClick={() => setBuyOpen(true)}>
                  <ShoppingCart className="h-4 w-4" />
                  Buy Book
                </Button>

                <Button
                  variant={favorited ? "default" : "outline"}
                  onClick={handleToggleFavorite}
                  className={favorited ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}
                >
                  <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
                  {favorited ? "Favorited" : "Favorite"}
                </Button>
              </div>

              <p className="text-foreground/80 font-body leading-relaxed text-base mb-6 whitespace-pre-line">
                {description || "No description available."}
              </p>

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

      {/* Buy Book Modal */}
      <Dialog open={buyOpen} onOpenChange={setBuyOpen}>
        <DialogContent className="sm:max-w-md backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Buy "{work?.title}"</DialogTitle>
            <DialogDescription className="font-body">
              Fill in your details to place an order.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBuySubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="buy-name" className="font-body text-sm">Full Name</Label>
              <Input id="buy-name" name="name" placeholder="Jane Doe" required />
              {formErrors.name && <p className="text-xs text-destructive font-body">{formErrors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buy-email" className="font-body text-sm">Email</Label>
              <Input id="buy-email" name="email" type="email" placeholder="jane@example.com" required />
              {formErrors.email && <p className="text-xs text-destructive font-body">{formErrors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buy-phone" className="font-body text-sm">Phone Number</Label>
              <Input id="buy-phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
              {formErrors.phone && <p className="text-xs text-destructive font-body">{formErrors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buy-address" className="font-body text-sm">Address</Label>
              <Input id="buy-address" name="address" placeholder="123 Main St, City, Country" required />
              {formErrors.address && <p className="text-xs text-destructive font-body">{formErrors.address}</p>}
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setBuyOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Submit Order
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
