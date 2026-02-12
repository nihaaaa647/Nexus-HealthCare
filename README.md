<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Hackathon-VNRVJIET%20AI%20WEEK-blueviolet" />
</p>

# 🏥 Nexus — Patient-Centric Clinical Workflow System

> **Real-time visibility. Structured coordination. Zero communication gaps.**

Nexus is a **Patient-Centric Clinical Workflow and Coordination System (PCCWCS)** built for the **VNRVJIET AI-WEEK VIBE CODING HACKATHON (KRITHOMEDH)**. It tackles the #1 cause of preventable medical errors — **fragmented communication between hospital departments** — by unifying all clinical actions around a single, real-time patient record.

---

## 🔥 The Problem

In most hospitals today:
- 📋 Doctors write prescriptions on paper → Pharmacy receives them hours later
- 🧪 Lab results sit in a queue → the attending physician is never notified
- 🩺 Nurses implement care instructions → but no one tracks completion
- 🔄 Shift handoffs rely on verbal summaries → critical tasks get lost

**Result:** Delayed treatment, redundant tests, and patient safety risks.

---

## 💡 Our Solution

Nexus provides a **unified, role-based dashboard** where every clinical action — prescriptions, lab requests, nursing tasks — flows through a **real-time action pipeline** visible to all stakeholders.

| Before Nexus | After Nexus |
|---|---|
| Scattered paper trails | Single patient timeline |
| "Did pharmacy get my order?" | Live status: Pending → In-Progress → Completed |
| Verbal shift handoffs | Structured clinical notes with author logs |
| No task prioritization | Smart P1/P2/P3 priority queues |

---

## ✨ Key Features

### 🧑‍⚕️ Role-Based Dashboards
Five distinct interfaces, each optimized for the user's workflow:

| Role | Dashboard Highlights |
|---|---|
| **Doctor** | Patient list, pending requests, **AI Safety Interceptor**, quick actions |
| **Nurse** | Priority care tasks, **AI Shift Handoff Summary**, custom task creation |
| **Pharmacy** | Prescription queue with status pipeline |
| **Lab** | Diagnostic request queue with result updating |
| **Admin** | User management, password resets, **Bottleneck Analytics** |
| **Reception** | Patient admission, insurance conditional logic, census management |

### 🚀 Standout Features (New!)

#### 🛡️ AI Prescription Safety Check
Nexus uses a real-time safety interceptor to prevent medical errors. When a Doctor prescribes medication, the system cross-references it with the patient's allergy records. If a conflict is detected (e.g., Penicillin for an allergic patient), a destructive Alert pops up requiring a conscious clinician override to proceed.

#### 📋 AI Nurse Shift Summary
To solve the "fragmented handoff" problem, we implemented an AI Shift Summary service. It analyzes the last 12 hours of completed clinical actions and generates a concise 5-bullet handoff report covering Clinical Progress, Pending Risks, and Key Observations powered by **Gemini 2.5 Flash**.

#### 📉 Admin Bottlenecks Dashboard
Administrators can now monitor hospital efficiency via a live visualization of **Mean Time to Completion (MTTC)**. Using **Recharts**, we track how long each department takes to fulfill orders. Automatic **Resource Alert** badges trigger if any department exceeds a 60-minute threshold.

### 📊 Patient Record Dashboard
- **Clinical Action Timeline** — reverse-chronological feed of all actions for a patient
- **Color-coded status tags** — Pending (amber), In-Progress (blue), Completed (green)
- **Priority badges** — P1 Critical (red), P2 Urgent, P3 Routine
- **Quick Actions** — one-click Prescription, Diagnostic, Nursing, and Notes creation

### 📝 Clinical Notes with Author Logs
- Any role can add timestamped notes to a patient record
- Each note shows **author name**, **role badge**, and **relative timestamp**
- Full audit trail — who said what and when

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR, API routes, file-based routing |
| **Language** | TypeScript | Type safety across the stack |
| **UI Library** | shadcn/ui + Radix | Accessible, production-ready components |
| **Styling** | Tailwind CSS | Rapid prototyping with design consistency |
| **State** | React Context + Zustand pattern | Simple, performant global state |
| **Persistence** | Server-side JSON + localStorage | Dual-layer: API for patients, localStorage for actions |
| **Analytics** | Recharts | MTTC visualization and bottleneck detection |
| **AI (Simulated)** | Gemini 2.5 Flash Logic | Safety checks and handoff summarization |
| **Theming** | next-themes | Dark/Light mode toggle |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone [https://github.com/nihaaaa647/pccwcs.git](https://github.com/nihaaaa647/pccwcs.git)
cd pccwcs

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
