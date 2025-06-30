``markdown
# 5. Copilot Prompts for Frontend

Paste these comments at the top of a new file to guide Copilot:

---

### Login Form

```plaintext
# Copilot: Generate `app/auth/login/page.tsx`
# - React client component
# - Uses `supabase` from "@/lib/supabase/client"
# - Email & password inputs
# - "Log In" button calling `signInWithPassword`
# - Shows errors
# - "Sign in with Google" button
Sign-Up Form
plaintext
Copy
Edit
# Copilot: Generate `app/auth/signup/page.tsx`
# - React client component
# - Uses `supabase` from "@/lib/supabase/client"
# - Email & password inputs
# - "Sign Up" button calling `signUp`
# - Shows success & error messages
# - Link to "/auth/login"
Dashboard UI
plaintext
Copy
Edit
# Copilot: Generate `app/dashboard/page.tsx`
# - Server component
# - Uses `supabase` from "@/lib/supabase/server"
# - Redirects to "/auth/login" if no session
# - Fetches `property_evaluations` for `session.user.id`
# - Renders list of evaluations
# - "Log Out" button calling `signOut`
New Evaluation Form
plaintext
Copy
Edit
# Copilot: Below the evaluations list in `app/dashboard/page.tsx`
# - Add form: address, bedrooms, bathrooms, area
# - On submit: POST to `/api/submit-evaluation`
# - Append new evaluation to the list on success
yaml
Copy
Edit

---

With this structure:

- **Each file** in `docs/` focuses on a single domain: setup, auth, API, UI, or Copilot prompts.  
- **Markdown headings** and **code blocks** give Copilot the exact context and snippets it needs to scaffold your files.  
- Opening these side-by-side with your project will accelerate development and keep everything organized.