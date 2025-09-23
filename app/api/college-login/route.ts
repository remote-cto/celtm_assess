import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import pool from "@/lib/database"; 

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Query for admin
    const result = await pool.query(
      `SELECT
        au.id, au.name, au.email, au.org_id, au.tenant_id,
        o.name as org_name, ac.plain_text_password
       FROM academic_user au
       JOIN org o ON au.org_id = o.id
       JOIN user_type ut ON au.user_type_id = ut.id
       JOIN admin_credentials ac ON au.id = ac.academic_user_id
       WHERE au.email = $1
       AND ut.user_type_desc = 'Admin'
       AND au.is_active = true
       AND o.is_active = true
       AND ac.is_active = true
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const admin = result.rows[0];

    
    const isPasswordCorrect = password === admin.plain_text_password;
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

   
    const cookieValue = JSON.stringify({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      org_id: admin.org_id,
      tenant_id: admin.tenant_id,
      org_name: admin.org_name,
    });

    // Cookie config
    const cookie = serialize("adminSession", cookieValue, {
      path: "/",
      httpOnly: false, 
      maxAge: 60 * 60 * 6, 
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", 
    });

    const res = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        org_id: admin.org_id,
        tenant_id: admin.tenant_id,
        org_name: admin.org_name,
      },
    });
    res.headers.set("Set-Cookie", cookie);

    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Clear adminSession cookie
  const cookie = serialize("adminSession", "", {
    path: "/",
    maxAge: 0,
  });
  const res = NextResponse.json({ loggedOut: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}

