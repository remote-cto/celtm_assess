
//lib/studentService.ts

import pool from './database';
import { StudentRegistrationData } from './validation';

export const studentService = {
  checkEmailExists: async (email: string, orgId: number): Promise<boolean> => {
    const result = await pool.query(
      `SELECT id FROM academic_user WHERE email = $1 AND org_id = $2 AND is_active = TRUE`,
      [email, orgId]
    );
    return result.rows.length > 0;
  },

  checkRegistrationNumberExists: async (registrationNumber: string, orgId: number): Promise<boolean> => {
    // Assuming academic_user has registration_number column
    const result = await pool.query(
      `SELECT id FROM academic_user WHERE registration_number = $1 AND org_id = $2 AND is_active = TRUE`,
      [registrationNumber, orgId]
    );
    return result.rows.length > 0;
  },

  checkOrgExists: async (orgId: number): Promise<{ org: any } | null> => {
    const result = await pool.query(
      `SELECT id, tenant_id, learning_entity_id FROM org WHERE id = $1 AND is_active = TRUE`,
      [orgId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return { org: result.rows[0] };
  },

  getUserTypeIdForStudent: async (learningEntityId: number): Promise<number | null> => {
    const result = await pool.query(
      `SELECT id FROM user_type WHERE learning_entity_id = $1 AND user_type_desc = 'Student' AND is_active = TRUE LIMIT 1`,
      [learningEntityId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].id;
  },

 createAcademicUser: async (data: StudentRegistrationData & {
  org_id: number;
  tenant_id: number;
  user_type_id: number;
}) => {
  const {
    name,
    email,
    phone,
    registration_number,
    org_id,
    tenant_id,
    user_type_id,
    password, // Add this
  } = data;

  const result = await pool.query(
    `
    INSERT INTO academic_user (
      org_id,
      tenant_id,
      user_type_id,
      name,
      email,
      phone,
      registration_number,
      password,         -- Add to SQL
      is_active,
      create_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NOW())
    RETURNING id, name, email, create_date
    `,
    [org_id, tenant_id, user_type_id, name, email, phone, registration_number, password] // Add password here
  );

  return result.rows[0];
},


  validateStudentData: async (data: StudentRegistrationData) => {
    const errors: string[] = [];

    const collegeIdInt = parseInt(data.college_id, 10);
    if (isNaN(collegeIdInt)) {
      errors.push('Invalid college selected');
      return { isValid: false, errors };
    }

    const orgResult = await studentService.checkOrgExists(collegeIdInt);
    if (!orgResult) {
      errors.push('Selected college does not exist');
      return { isValid: false, errors };
    }
    const org = orgResult.org;

    // Check email uniqueness scoped to org
    if (await studentService.checkEmailExists(data.email, org.id)) {
      errors.push('Email already exists for the selected college');
    }

    // Check registration number uniqueness scoped to org
    if (await studentService.checkRegistrationNumberExists(data.registration_number, org.id)) {
      errors.push('Registration number already exists for the selected college');
    }

    // Get user_type for Student
    const userTypeId = await studentService.getUserTypeIdForStudent(org.learning_entity_id);
    if (!userTypeId) {
      errors.push("User type 'Student' is not configured for the selected college");
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      errors: [],
      orgId: org.id,
      tenantId: org.tenant_id,
      userTypeId,
      learningEntityId: org.learning_entity_id,
    };
  },
};

export default studentService;
