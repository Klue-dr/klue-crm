import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./components/Login";
import TopBar from "./components/TopBar";
import OrderKanban from "./components/OrderKanban";

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (checkingSession) {
    return null;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <TopBar theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <OrderKanban />
    </div>
  );
}
