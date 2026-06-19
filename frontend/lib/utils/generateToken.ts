import jwt from "jsonwebtoken";

export interface TokenPayload {
    id: string;
    email: string;
    role: "user" | "admin";
}

export function generateToken(payload: TokenPayload): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }

    const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
    });

    return token;
}

export function verifyToken(token: string): TokenPayload | null {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
