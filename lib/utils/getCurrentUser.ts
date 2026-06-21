import { cookies } from "next/headers";
import { verifyToken } from "./verifyToken";

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();

        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return null;
        }

        const payload = verifyToken(token);

        if (!payload) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}