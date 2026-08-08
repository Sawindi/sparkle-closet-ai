# SparkleCloset AI 👚✨

An interactive, responsive **Next.js digital wardrobe assistant and AI outfit stylist dashboard**. This project is a high-fidelity frontend prototype developed using an AI-assisted software development workflow, with planned integrations for computer vision, semantic search, and live LLM orchestration.

## 🚀 Current Features

* **My Capsule Closet:** A dynamic visual grid displaying wardrobe items categorized by clothing type, with interactive metadata tags.
* **Daily AI Stylist Chat:** An interactive conversational interface with client-side keyword routing, input validation, and contextual fallback responses.
* **Weekly Outfit Planner:** A calendar interface for organizing styled garment combinations across a 7-day schedule.
* **Closet Insights:** An analytics dashboard displaying wardrobe statistics, including total items, frequently used colours, and style category distributions.

## 🧠 Algorithmic Guardrails

The stylist interface currently includes lightweight client-side guardrails:

* **Input validation and fallbacks:** Recognizes common greetings and provides a contextual welcome response.
* **Domain validation:** Detects prompts outside the intended fashion/wardrobe scope and provides a fallback response to keep the assistant focused on its intended purpose.

## 🛠️ Tech Stack

* **Framework:** Next.js 14, App Router, TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** Radix UI
* **Icons:** Lucide
* **Development Workflow:** AI-assisted development using Bolt.new and Claude

## 🗺️ Planned Integrations

### Computer Vision Backend

Integrate a Python FastAPI backend with **YOLOv8** to automatically detect and crop clothing items from user-uploaded images.

### Semantic Search

Integrate **FashionCLIP** embeddings and vector search to enable semantic clothing similarity and automated wardrobe tagging.

### Live LLM Orchestration

Replace the current client-side simulated chat responses with live LLM integration using the **Vercel AI SDK**.

## 📌 Project Status

**Current status:** Frontend prototype / work in progress.

The current version focuses on the user experience, interface design, wardrobe management flows, and client-side interaction logic. Backend AI capabilities are planned for future development.
