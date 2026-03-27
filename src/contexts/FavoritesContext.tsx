import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface FavoriteBook {
  id: string;
  title: string;
  author: string;
  year?: number;
  cover?: string;
  coverId?: number;
}

interface FavoritesContextType {
  favorites: FavoriteBook[];
  addFavorite: (book: FavoriteBook) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (book: FavoriteBook) => void;
}

const STORAGE_KEY = "biblion_favorites";

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteBook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persist = (next: FavoriteBook[]) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addFavorite = useCallback((book: FavoriteBook) => {
    setFavorites((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      const next = [...prev, book];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((b) => b.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (book: FavoriteBook) => {
      if (favorites.some((b) => b.id === book.id)) {
        removeFavorite(book.id);
      } else {
        addFavorite(book);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
