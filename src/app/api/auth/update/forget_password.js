import { NextResponse } from "next/server";
import { db } from "@/db"; // your drizzle db instance
import { users, verificationTokens } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq, and, gte } from "drizzle-orm"; // Import `and` and `gte`
import { validatePasswordRules } from "@/src/utils/validators.js";

export async function POST(request) {
    try {
        // Step 1: Get all the necessary information from the user
        const { email, newPassword, confirmPassword, token } = await request.json();

        // Step 2: Perform comprehensive validation on the inputs
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        if (!newPassword) {
            return NextResponse.json({ error: "New password is required" }, { status: 400 });
        }
        if (!confirmPassword) {
            return NextResponse.json({ error: "Confirm Password is required" }, { status: 400 });
        }
        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        // Validate the new password against your custom rules
        const passwordError = validatePasswordRules(newPassword);
        if (passwordError) {
            return NextResponse.json({ error: passwordError }, { status: 400 });
        }

        // Step 3: Find a valid, unused, unexpired token of the correct type
        const [validToken] = await db.select().from(verificationTokens).where(
            and(
                eq(verificationTokens.email, email),
                eq(verificationTokens.token, token),
                eq(verificationTokens.typeOfToken, "FORGOT_PASSWORD"), // <-- ADDED: Ensure it's a password reset token
                eq(verificationTokens.tokenUsed, false),
                gte(verificationTokens.expiryAt, new Date())
            )
        );
        
        if (!validToken) {
            return NextResponse.json({ error: "Invalid or expired password reset token" }, { status: 401 });
        }
        
        // Step 4: Find the corresponding user to update
        const [userToUpdate] = await db.select().from(users).where(eq(users.email, email));
        if(!userToUpdate){
             return NextResponse.json({ error: "User associated with this token not found." }, { status: 404 });
        }

        // Step 5: Hash the NEW password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Step 6: Update the user's password and DELETE the used token
        await db.update(users)
            .set({ hashedPassword: hashedPassword })
            .where(eq(users.id, userToUpdate.id));

        // CHANGED: Delete the token so it can never be used again
        await db.delete(verificationTokens)
            .where(eq(verificationTokens.id, validToken.id));

        // Step 7: Send a success response
        return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 });

    } catch (err) {
        // Step 8: The safety net for any unexpected server errors
        console.error("Reset password error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

