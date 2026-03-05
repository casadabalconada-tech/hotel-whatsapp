import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateTaxiCompanyInput } from "@/lib/schemas";


// =======================
// GET → listar empresas
// =======================
export async function GET() {
  const companies = await prisma.taxiCompany.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(companies);
}

// =======================
// POST → crear empresa
// =======================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateTaxiCompanyInput.parse(body);

    const company = await prisma.taxiCompany.create({
      data,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Datos inválidos" },
      { status: 400 }
    );
  }
}