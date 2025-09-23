// lib/validation.ts
export interface StudentRegistrationData {
  name: string;
  email: string;
  phone: string;
  registration_number: string;
  college_id: string;  
  password: string;    
}


export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  },

  isValidCollegeId: (collegeId: string): boolean => {
    const parsed = parseInt(collegeId);
    return !isNaN(parsed) && parsed > 0;
  },

  validateRegistrationData: (data: StudentRegistrationData) => {
    const errors: string[] = [];

    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.registration_number ||
      !data.college_id
    ) {
      errors.push("All fields are required");
    }

    if (data.email && !validationUtils.isValidEmail(data.email)) {
      errors.push("Invalid email format");
    }

    if (data.phone && !validationUtils.isValidPhone(data.phone)) {
      errors.push("Invalid phone number format");
    }

    if (data.college_id && !validationUtils.isValidCollegeId(data.college_id)) {
      errors.push("Invalid college ID format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default validationUtils;
