---

### `docs/03-API-ROUTES.md`

```markdown
# 3. API Routes

## a) On-Demand Evaluation

**`app/api/evaluate/route.ts`**:

```ts
import { NextResponse } from "next/server";
import { evaluateProperty } from "@/agent/evaluator";

export async function GET(req: Request) {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const prop = { id: Number(params.id), ...params };
  const result = await evaluateProperty(prop);
  return NextResponse.json(result);
}
b) Bulk Workflow Trigger
app/api/workflow/route.ts:

ts
Copy
Edit
import { NextResponse } from "next/server";
import { propertyEvaluationFlow } from "@/workflow/flow";

export async function POST() {
  await propertyEvaluationFlow();
  return NextResponse.json({ status: "ok" });
}
c) Protected Submission Route
app/api/submit-evaluation/route.ts:

ts
Copy
Edit
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { evaluateProperty } from "@/agent/evaluator";

export async function POST(req: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  const result = await evaluateProperty(payload);
  await supabase
    .from("property_evaluations")
    .insert({ user_id: session.user.id, ...payload, summary: result.summary, value: result.estimatedValue });

  return NextResponse.json(result);
}