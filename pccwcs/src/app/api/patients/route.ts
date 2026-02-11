import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'patients.json');

function readPatients() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writePatients(patients: any[]) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(patients, null, 2), 'utf-8');
}

export async function GET() {
    const patients = readPatients();
    return NextResponse.json(patients);
}

export async function POST(request: Request) {
    const newPatient = await request.json();

    // Assign id and admission date if not present
    if (!newPatient.id) {
        newPatient.id = `p${Date.now()}`;
    }
    if (!newPatient.admissionDate) {
        newPatient.admissionDate = new Date().toISOString();
    }

    const patients = readPatients();
    patients.push(newPatient);
    writePatients(patients);

    return NextResponse.json(newPatient, { status: 201 });
}

export async function PUT(request: Request) {
    const updatedPatients = await request.json();
    writePatients(updatedPatients);
    return NextResponse.json(updatedPatients);
}
