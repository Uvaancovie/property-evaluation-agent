b) Auth Providers
SITE URL:
Supabase → Authentication → Settings → Site URL → http://localhost:3000

Enable Providers:
Supabase → Authentication → Providers → Enable Email/Password & Google (enter Google Client ID/Secret).

c) Database Schema & RLS
Run in Supabase SQL Editor:

sql
Copy
Edit
-- 1. Create table
create table property_evaluations (
  id bigserial primary key,
  user_id uuid references auth.users(id),
  address text,
  bedrooms int,
  bathrooms int,
  area float,
  summary text,
  value int,
  inserted_at timestamptz default now()
);

-- 2. Enable RLS
alter table property_evaluations enable row level security;

-- 3. Policies
create policy "Owners only" 
  on property_evaluations 
  for select 
  using (auth.uid() = user_id);

create policy "Owners insert" 
  on property_evaluations 
  for insert 
  with check (auth.uid() = user_id);
yaml
Copy
Edit

---

### `docs/02-AUTH-IMPLEMENTATION.md`

```markdown
# 2. Authentication Implementation

## a) Client-side Supabase

**`lib/supabase/client.ts`**:

```ts
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
b) Server-side Supabase
lib/supabase/server.ts:

ts
Copy
Edit
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll: () => cookies().getAll(),
      setAll: (cs) => cs.forEach(c => cookies().set(c.name, c.value, c.options)),
    }
  }
);
c) Sign-Up Page
app/auth/signup/page.tsx:

tsx
Copy
Edit
"use client";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function SignupPage() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErr(error.message);
    else setMsg("Check your email to confirm sign-up.");
  };

  return (
    <form onSubmit={handleSignup}>
      <h1>Sign Up</h1>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      <p>Already have an account? <a href="/auth/login">Log In</a></p>
    </form>
  );
}
d) Login Page
app/auth/login/page.tsx:

tsx
Copy
Edit
"use client";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [err, setErr] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    else window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Log In</h1>
      {err && <p className="error">{err}</p>}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Log In</button>
      <button type="button" onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}>
        Sign in with Google
      </button>
      <p>Need an account? <a href="/auth/signup">Sign Up</a></p>
    </form>
  );
}