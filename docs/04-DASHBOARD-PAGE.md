```markdown
# 4. Dashboard Page (Protected)

**`app/dashboard/page.tsx`** (Server Component):

```tsx
import { supabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/auth/login");

  const { data: evaluations } = await supabase
    .from("property_evaluations")
    .select("*")
    .eq("user_id", session.user.id);

  return (
    <main>
      <h1>Welcome, {session.user.email}</h1>
      <button onClick={async () => { await supabase.auth.signOut(); redirect("/auth/login"); }}>
        Log Out
      </button>

      <section>
        <h2>Your Evaluations</h2>
        <ul>
          {evaluations?.map(e => (
            <li key={e.id}>
              {e.address} — R{e.value}
            </li>
          ))}
        </ul>
      </section>

      {/* TODO: Add form to submit a new evaluation */}
    </main>
  );
}