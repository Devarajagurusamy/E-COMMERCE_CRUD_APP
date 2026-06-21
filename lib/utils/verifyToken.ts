import jwt from "jsonwebtoken";

export interface TokenPayload {
    id: string;
    email: string;
    role: "user" | "admin";
}

export function verifyToken(token: string): TokenPayload | null {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }

    try {
        return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
        console.log(error);
        return null;
    }

    
}