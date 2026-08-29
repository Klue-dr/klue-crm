import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const COLUMNS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "returned", label: "Returned" },
  { key: "cancelled", label: "Cancelled" },
];

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function OrderKanban() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragOverCol, setDragOverCol] = useState(null);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-kanban")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("id, customer_name, product_id, amount, status, status_updated_at, products(name)")
      .order("status_updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update status:", error);
      fetchOrders();
    }
  }

  function handleDrop(e, colKey) {
    e.preventDefault();
    setDragOverCol(null);
    const orderId = e.dataTransfer.getData("orderId");
    if (orderId) updateStatus(orderId, colKey);
  }

  if (loading) {
    return <div style={{ padding: "2rem", color: "var(--text-secondary)" }}>Loading orders…</div>;
  }

  return (
    <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "1rem" }}>
      {COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.key)}
            style={{
              minWidth: "220px",
              flex: "1",
              background: dragOverCol === col.key ? "var(--accent)22" : "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "10px",
              transition: "background 0.15s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                padding: "0 4px",
              }}
            >
              <span style={{ fontWeight: 500, fontSize: "14px" }}>{col.label}</span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "1px 8px",
                }}
              >
                {colOrders.length}
              </span>
            </div>

            {colOrders.map((order) => (
              <div
                key={order.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("orderId", order.id)}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "8px",
                  cursor: "grab",
                }}
              >
                <div style={{ fontWeight: 500, fontSize: "13px", marginBottom: "2px" }}>
                  {order.customer_name || "Unknown customer"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {order.products?.name || "Product"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ fontWeight: 500 }}>
                    ₦{Number(order.amount || 0).toLocaleString()}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{timeAgo(order.status_updated_at)}</span>
                </div>
              </div>
            ))}

            {colOrders.length === 0 && (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", padding: "8px 4px" }}>
                No orders here
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
