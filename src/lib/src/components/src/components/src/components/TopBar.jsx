import { supabase } from "../lib/supabaseClient";

export default function TopBar({ theme, onToggleTheme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "16px" }}>Klue CRM</span>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          onClick={onToggleTheme}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "13px",
            color: "var(--text)",
          }}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "13px",
            color: "var(--text)",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
