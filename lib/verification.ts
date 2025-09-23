// lib/verification.ts
import crypto from "crypto";

const verificationCodes = new Map<
  string,
  { code: string; data: any; expires: number }
>();

export const verificationService = {
  generateCode: (): string => {
    return crypto.randomInt(100000, 999999).toString();
  },

  storeCode: (
    email: string,
    code: string,
    data: any,
    expirationMinutes: number = 10
  ) => {
    const expiresAt = Date.now() + expirationMinutes * 60 * 1000;
    verificationCodes.set(email, {
      code,
      data,
      expires: expiresAt,
    });
  },

  getStoredData: (email: string) => {
    return verificationCodes.get(email);
  },

  isCodeValid: (email: string, code: string): boolean => {
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return false;
    }

    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return false;
    }

    return storedData.code === code;
  },

  deleteCode: (email: string) => {
    verificationCodes.delete(email);
  },

  updateCode: (email: string, newCode: string) => {
    const storedData = verificationCodes.get(email);
    if (storedData) {
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      verificationCodes.set(email, {
        ...storedData,
        code: newCode,
        expires: expiresAt,
      });
    }
  },
};

export default verificationService;
