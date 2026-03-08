import { NextResponse } from "next/server";

let translations = [
  {
    id: "1",
    messageKey: "checkin_welcome",
    language: "EN",
    text: "Welcome to the hotel"
  }
];

export async function GET() {
  return NextResponse.json(translations);
}

export async function PUT(req: Request) {

  const data = await req.json();
  translations = data;

  return NextResponse.json({ success: true });
}