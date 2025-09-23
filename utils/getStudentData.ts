// utils/getStudentData.ts

export function getStudentData(): {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  college_name: string;
  org_id?: number;
  tenant_id?: number;
  user_type_id?: number;
} | null {
  if (typeof window !== "undefined") {
    try {
      const cookieValue = getCookie("studentSession");
      if (cookieValue) {
        // FIX: Decode the URL-encoded cookie value before parsing.
        const decodedValue = decodeURIComponent(cookieValue);
        const cookieData = JSON.parse(decodedValue);

        // Ensure the parsed data is valid and has an ID before returning
        if (cookieData?.id) {
          return cookieData;
        }
      }
    } catch (error) {
      console.error("Failed to parse student session cookie:", error);
      // If parsing fails, treat it as no data found
      return null;
    }
  }
  // If no cookie is found or we are on the server-side, return null
  return null;
}

// Helper function to get cookie by name (No changes needed here)
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Function to clear student session (No changes needed here)
export function clearStudentSession(): void {
  if (typeof window !== "undefined") {
    // Clear cookie by setting it to expire in the past
    document.cookie =
      "studentSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}