# Presentation Content: Nexus (PCCWCS)

Here is the content structured for your PowerPoint slides.

---

## Slide 1: Problem Statement
**Title:** The Silent Crisis in Clinical Coordination

**Core Issue:**
Fragmented communication between hospital departments is the #1 cause of preventable medical errors and treatment delays.

**Key Pain Points:**
*   **Disconnected Workflows:** Doctors write orders, but Pharmacy/Lab/Nursing see them hours later due to manual handoffs or disjointed systems.
*   **Lack of Visibility:** A doctor has no real-time way to know if a critical medication has actually been administered or if a STAT lab result is ready.
*   **Operational Inefficiency:** Nurses spend 30% of their shift coordinating via phone calls and chasing updates instead of caring for patients.
*   **Patient Safety Risks:** Verbal orders and paper trails lead to transcription errors and missed care instructions.

---

## Slide 2: Proposed Solution
**Title:** Nexus — A Unified, Patient-Centric Clinical Workflow System

**The Solution:**
A real-time, role-based orchestration platform that unifies all clinical stakeholders around a single, shared patient timeline.

**Key Capabilities:**
1.  **Unified Patient Record:** A single "source of truth" dashboard where every action (Prescription, Lab, Nursing) is logged in a reverse-chronological timeline.
2.  **Real-Time Action Pipeline:**
    *   Doctor initiates an order $\rightarrow$ Instantly appears in the target department's queue.
    *   Department updates status (Pending $\rightarrow$ In-Progress $\rightarrow$ Completed) $\rightarrow$ Instantly reflects on the doctor's screen.
3.  **Smart Role-Based Views:**
    *   **Doctors:** Manage patients, initiate requests, view results.
    *   **Nurses:** Track care tasks sorted by priority (P1 Critical first).
    *   **Pharmacy/Lab:** Manage incoming queues with status tracking.
4.  **Audit & Accountability:** Every note and action is timestamped with author logs, ensuring complete transparency.

---

## Slide 3: System Architecture
**Title:** High-Level Technical Architecture

**Architecture Style:**
Modern, Event-Driven Client-Server Architecture optimized for real-time responsiveness.

**Three-Layer Design:**
1.  **Presentation Layer (The Dashboards):**
    *   Built with **Next.js App Router** for fast, server-side rendered initial loads.
    *   5 Distinct Role Interfaces (Doctor, Nurse, Lab, Pharmacy, Reception).
    *   Shared component library for consistent UX (PatientTimeline, ActionCards).

2.  **State Management Layer (The Brain):**
    *   **Global Context Store:** Centralized state management handling the "Action Pipeline."
    *   **Optimistic UI Updates:** Interface updates immediately while data persists in the background, ensuring a snappy feel.

3.  **Peristence Layer (The Data):**
    *   **Dual-Strategy persistence:**
        *   **Server-Side JSON API:** For reliable, persistent Patient Records.
        *   **Client-Side Persistence:** For high-frequency Action and Note updates, simulating a distributed real-time database.

**Data Flow:**
Doctor (Action) $\rightarrow$ Global Store $\rightarrow$ Department Queue $\rightarrow$ Status Update $\rightarrow$ Global Store events $\rightarrow$ Patient Timeline Update.

---

## Slide 4: Technology Stack
**Title:** Built with a Modern Vibe Coding Stack

*   **Frontend Framework:** **Next.js 16 (App Router)**
    *   *Why?* Fast performance, excellent SEO for records, and robust routing.
*   **Language:** **TypeScript**
    *   *Why?* Type safety prevents critical errors in medical data handling.
*   **UI Library:** **shadcn/ui + Radix UI + Lucide Icons**
    *   *Why?* Accessible, professional, medical-grade aesthetic with dark mode support.
*   **Styling:** **Tailwind CSS**
    *   *Why?* Rapid UI development and consistent design system.
*   **State Management:** **React Context + Hooks**
    *   *Why?* Lightweight, efficient state handling without the boilerplate of Redux.
