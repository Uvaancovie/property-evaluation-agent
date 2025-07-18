````markdown
# 🏠 Property Evaluator

[![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/property-evaluator-next/ci.yml?branch=main)](https://github.com/your-org/property-evaluator-next/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A zero-infra, free-tier Property Evaluation Agent & Workflow built with Next.js (App Router), TypeScript, LangChain, Supabase, and Mistral via Hugging Face. Deployable in under 60 seconds on Vercel (free tier).

---

## 📋 Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Environment Variables](#environment-variables)  
5. [Project Structure](#project-structure)  
6. [Usage](#usage)  
   - [Local Development](#local-development)  
   - [API Endpoints](#api-endpoints)  
7. [Examples](#examples)  
8. [Testing](#testing)  
9. [Deployment](#deployment)  
10. [Roadmap](#roadmap)  
11. [Contributing](#contributing)  
12. [License](#license)  
13. [Author](#author)  

---

## 🔥 Features

- **On-Demand Valuation**: `GET /api/evaluate` returns summary + estimated value.  
- **Bulk Workflow**: `POST /api/workflow/run` fetches new properties, evaluates, stores results, and notifies via Slack.  
- **100 % Free-Tier Stack**: Supabase (DB), Mistral LLM, Hugging Face API, Vercel hosting.  
- **Zero-Config Deploy**: Vercel auto-detects Next.js and provisions functions.  
- **Modular Prompts**: Plain-text templates for rapid A/B testing without code changes.

---

## 🛠 Prerequisites

- **Node.js** v18 or higher  
- **npm** (comes with Node.js)  
- (optional) **Vercel CLI**: `npm i -g vercel`  
- **Supabase** project (free tier)  
- **Hugging Face** account + API token  
- **Slack** workspace + Incoming Webhook URL (or any webhook)

---

## 🚀 Installation

```bash
git clone git@github.com:your-org/property-evaluator-next.git
cd property-evaluator-next
npm install
````

---

## ⚙️ Environment Variables

Create a file named `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>

HF_API_TOKEN=hf_<YOUR_HUGGINGFACE_TOKEN>
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/…
```

---

## 📁 Project Structure

```text
property-evaluator-next/
├── .env.local                    # Local env vars (gitignored)
├── vercel.json                   # Vercel v0 config
├── next.config.js                # Next.js settings
├── README.md                     # This file
├── agent/
│   ├── evaluator.ts              # Core LLM + valuation logic
│   └── prompts/
│       ├── property_summary.txt  # “Summarise this property…” template
│       └── valuation_criteria.txt
├── lib/
│   ├── supabaseClient.ts         # Supabase client
│   └── llm.ts                    # LangChain → Mistral setup
├── workflow/
│   └── flow.ts                   # Bulk evaluate → persist → notify
├── app/
│   ├── api/
│   │   ├── evaluate/route.ts     # GET /api/evaluate
│   │   └── workflow/route.ts     # POST /api/workflow/run
│   └── page.tsx                  # Optional: basic UI form
├── types/
│   └── index.d.ts                # TS interfaces (Property, EvaluationResult)
├── tests/
│   ├── evaluator.test.ts         # Tests for evaluateProperty
│   └── flow.test.ts              # Tests for propertyEvaluationFlow
├── package.json
├── tsconfig.json
└── Dockerfile                    # Optional: local container build
```

---

## 📖 Usage

### Local Development

```bash
npm run dev
# → http://localhost:3000
```

### API Endpoints

* **On-Demand Evaluation**

  ```
  GET /api/evaluate?id=1&address=123%20Main%20St&bedrooms=3&bathrooms=2&area=120
  ```

  **Response:**

  ```json
  {
    "id": 1,
    "summary": "A cozy 3-bedroom, 2-bathroom home of 120 m² in a quiet neighborhood...",
    "estimatedValue": 350000
  }
  ```

* **Full Workflow Run**

  ```
  POST /api/workflow/run
  ```

  Initiates bulk evaluation of new records and posts a summary to Slack.

---

## 🔍 Examples

**cURL**

```bash
curl "http://localhost:3000/api/evaluate?id=5&address=456%20Oak%20Drive&bedrooms=4&bathrooms=3&area=200"
```

**JavaScript**

```js
fetch('/api/evaluate?id=5&address=456 Oak Drive&bedrooms=4&bathrooms=3&area=200')
  .then(res => res.json())
  .then(console.log);
```

---

## ✅ Testing

```bash
npm run test
```

* **Vitest/Jest** covers `evaluateProperty` logic and `propertyEvaluationFlow`.

---

## 🌐 Deployment

1. Push to GitHub.
2. In Vercel dashboard, import your repo.
3. Add the same environment variables under **Settings → Environment Variables**.
4. Click **Deploy** — Vercel auto-configures routes and functions.

---

## 📅 Roadmap

* [ ] Add Supabase Edge Function for on-the-edge inference
* [ ] Monthly GitHub Action for drift monitoring & alerts
* [ ] Support additional LLMs (Falcon, Mixtral) via config
* [ ] Web UI enhancements: map view of properties

---

## 🤝 Contributing

We welcome contributions!

* Fork the repo & create a feature branch
* Adhere to coding standards & update tests
* Submit via PR and reference an issue

See [`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE) for reporting bugs or requesting features.

---

## 📜 License

MIT © 2025 Way2FlyDigital

---

## 🧑‍💻 Author

Mr Covie • [LinkedIn](https://linkedin.com/in/uvaancovie) • way2flydigital.com

```
```
