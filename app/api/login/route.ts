// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import pool from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, registration_number, password, college_id, agreedToTerms } = body;

    if (!email || !registration_number || !password || !college_id) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT au.id, au.name, au.email, au.registration_number, au.org_id, au.password, org.name as college_name
      FROM academic_user au
      INNER JOIN user_type ut ON au.user_type_id = ut.id
      INNER JOIN org ON au.org_id = org.id
      WHERE au.email = $1
        AND au.registration_number = $2
        AND au.org_id = $3
        AND ut.user_type_desc = 'Student'
        AND au.is_active = TRUE
        AND ut.is_active = TRUE
        AND org.is_active = TRUE
      LIMIT 1
    `;
    const result = await pool.query(query, [
      email,
      registration_number,
      Number(college_id),
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const student = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Prepare cookie data (store minimal data only)
    const cookieValue = JSON.stringify({
      id: student.id,
      name: student.name,
      email: student.email,
      registration_number: student.registration_number,
      org_id: student.org_id,
      college_name: student.college_name,
    });

    // Cookie config
    const cookie = serialize("studentSession", cookieValue, {
      path: "/",
      httpOnly: false, // false so you can read on client (for learning only)
      maxAge: 60 * 60 * 6, // 6 hours
      sameSite: "lax",
      secure: false, // true in prod
    });

    const res = NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        registration_number: student.registration_number,
        org_id: student.org_id,
        college_name: student.college_name,
      },
    });

    if (agreedToTerms) {
      const checkboxQuery = `
        INSERT INTO academic_checkbox (user_id, is_agreed, user_name, college_name)
        VALUES ($1, $2, $3, $4);
      `;
      try {
        await pool.query(checkboxQuery, [student.id, true, student.name, student.college_name]);
      } catch (insertErr) {
        console.error("Failed to insert checkbox agreement:", insertErr);
        // Continue login process even if recording agreement fails
      }
    }

    res.headers.set("Set-Cookie", cookie);

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Clear studentSession cookie
  const cookie = serialize("studentSession", "", {
    path: "/",
    maxAge: 0,
  });
  const res = NextResponse.json({ loggedOut: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
