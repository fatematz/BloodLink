import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const h = await headers(); 
    const session = await auth.api.getSession({ headers: h });
    
    return NextResponse.json(session?.user || null);
  } catch (error) {
    return NextResponse.json(null);
  }
}