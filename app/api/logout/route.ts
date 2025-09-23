import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { userType } = await req.json();

    let cookieName = "studentSession"; 
    if (userType === "admin") {
      cookieName = "adminSession";
    }

    // Redirect to the login page
    const url = req.nextUrl.clone();
    url.pathname = '/Login';
    const response = NextResponse.redirect(url, { status: 307 });

    // Create a "blank" cookie with an expiration date in the past.
    // Being explicit about all attributes is key to ensuring it gets deleted.
    const expiredCookie = serialize(cookieName, "", {
      path: "/",
      expires: new Date(0), // The key to deletion
      httpOnly: true,
      // Set 'secure' dynamically based on environment. Important for production.
      secure: process.env.NODE_ENV === "production",
      // Use 'lax' as a sensible default. Adjust if your login cookie used 'strict'.
      sameSite: "lax", 
    });

    // Set the explicit deletion cookie on the redirect response
    response.headers.set("Set-Cookie", expiredCookie);

    return response;

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}