import * as jose from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production-32chars!!-elmomtaz"
);

export type JwtPayload = {
  sub: string; // user id
  role: "student" | "teacher" | "admin";
  deviceId?: string;
  phone?: string;
};

const ISSUER = "elmomtaz";

export async function signToken(payload: JwtPayload, expiresIn = "7d"): Promise<string> {
  return await new jose.SignJWT({ ...payload } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET, { issuer: ISSUER });
    return {
      sub: String(payload.sub ?? ""),
      role: payload.role as JwtPayload["role"],
      deviceId: payload.deviceId as string | undefined,
      phone: payload.phone as string | undefined,
    };
  } catch {
    return null;
  }
}

// For middleware edge — re-export verify
export async function getRoleFromToken(token: string | undefined | null): Promise<JwtPayload | null> {
  if (!token) return null;
  return verifyToken(token);
}
