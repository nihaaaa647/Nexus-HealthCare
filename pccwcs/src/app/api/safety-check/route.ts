import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prescription, allergies } = await request.json();

        if (!prescription || !allergies) {
            return NextResponse.json({ error: 'Missing prescription or allergies' }, { status: 400 });
        }

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const prescriptionLower = prescription.toLowerCase();

        // Demo logic: Check for Penicillin conflict
        // In a real scenario, this would be a prompt to Gemini 2.5 Flash
        const hasPenicillinAllergy = allergies.some((a: string) => a.toLowerCase().includes('penicillin'));
        const isPenicillinPrescribed = prescriptionLower.includes('penicillin') ||
            prescriptionLower.includes('amoxicillin') ||
            prescriptionLower.includes('augmentin');

        if (hasPenicillinAllergy && isPenicillinPrescribed) {
            return NextResponse.json({
                conflict: true,
                severity: 'High',
                message: `Potential Allergy Conflict Detected: The patient has a documented Penicillin allergy, and "${prescription}" is a Penicillin-based medication.`
            });
        }

        // Generic keyword check for demo
        for (const allergy of allergies) {
            if (prescriptionLower.includes(allergy.toLowerCase())) {
                return NextResponse.json({
                    conflict: true,
                    severity: 'High',
                    message: `Allergy Alert: The prescribed medication "${prescription}" matches the patient's recorded allergy: "${allergy}".`
                });
            }
        }

        return NextResponse.json({
            conflict: false,
            message: 'No immediate safety conflicts detected.'
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
