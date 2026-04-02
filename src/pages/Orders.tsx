import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PackageOpen } from "lucide-react";

interface Order {
  id: string;
  book_title: string;
  full_name: string;
  email: string;
  created_at: string;
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, book_title, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setOrders(data ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">My Orders</h1>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <p className="text-center text-destructive font-body">{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-body">No orders yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <p className="font-display font-semibold text-foreground">{order.book_title}</p>
                <p className="text-sm text-muted-foreground font-body">{order.full_name} · {order.email}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
