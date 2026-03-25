import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-display font-bold tracking-tight text-foreground">
              Biblion
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground font-body">
                  Hi, {user.name}
                </span>
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => setAuthOpen(true)}>
                <User className="h-4 w-4 mr-1.5" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
