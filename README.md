# SparkleCloset AI 👚✨

An interactive, responsive full-stack Next.js digital wardrobe assistant and AI outfit stylist dashboard. This application serves as a high-fidelity frontend prototype built using an AI-agent-assisted development workflow.

## 🚀 Current Features (Production-Ready Frontend)
* **My Capsule Closet:** A dynamic visual grid that displays wardrobe assets categorized by clothing type with interactive metadata tags.
* **Daily AI Stylist Chat:** An interactive conversational interface equipped with client-side keyword routing and semantic input guardrails.
* **Weekly Outfit Planner:** A clean calendar layout mapping styled garment combinations across a 7-day schedule.
* **Closet Insights:** An analytics layout visualizing wardrobe statistics (most-worn colors, total items, and style category distributions).

## 🧠 Algorithmic Guardrails (Implemented)
* **Input Validation & Fallbacks:** The chat interface features a strict local validation check. If an input greeting is detected (e.g., "hii"), it routes to a warm system welcome. If a prompt falls completely out of the fashion domain, the script intercepts it and fires an automated contextual guardrail fallback to protect system scope.

## 🛠️ Tech Stack
* **Framework:** Next.js 14 (App Router, TypeScript)
* **Styling & Components:** Tailwind CSS, Radix UI primitives, Lucide Icons
* **Workflow:** Prototyped and orchestrated via Bolt.new (Claude 3.5 Sonnet)

## 🗺️ Next Steps & Planned Integrations
1. **Computer Vision Backend:** Integrate a Python FastAPI server running a real **YOLOv8** model to automatically crop and detect clothing items from user uploads.
2. **Semantic Search:** Add **FashionCLIP** vector embeddings to store clothing attributes in a vector database for smart, automated similarity tagging.
3. **Live LLM Orchestration:** Swap out the client-side simulated chat state with the **Vercel AI SDK** to connect the stylist chat directly to live LLM APIs.
