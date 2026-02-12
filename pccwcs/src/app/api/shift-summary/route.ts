import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { patientName, actions } = await request.json();

        if (!actions || !Array.isArray(actions)) {
            return NextResponse.json({ error: 'Missing or invalid actions data' }, { status: 400 });
        }

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Group actions by type for smarter summary simulation
        const medications = actions.filter(a => a.type === 'Prescription');
        const labs = actions.filter(a => a.type === 'Lab Request');
        const nursing = actions.filter(a => a.type === 'CareInstruction');

        // Simulated Gemini 1.5 Flash Summary Logic
        const summary = [
            `Patient ${patientName || 'Record'} shows stable progression over the last 12 hours.`,
            medications.length > 0
                ? `Medication management: ${medications.length} prescriptions completed, including ${medications[0].description}.`
                : "No new medications were administered during this shift.",
            labs.length > 0
                ? `Diagnostic status: ${labs.length} lab requests processed. Results pending for ${labs[0].description}.`
                : "No pending laboratory results for the next shift.",
            nursing.length > 0
                ? `Nursing Care: Focused on ${nursing[0].description}. Patient remains cooperative.`
                : "Routine nursing care provided; no significant deviations from the care plan.",
            actions.some(a => a.priority === 'P1')
                ? "WARNING: High-priority actions were noted. Monitor vitals closely in the coming hours."
                : "Patient is currently in a routine monitoring phase with no immediate high-risk alerts."
        ];

        return NextResponse.json({ summary });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
