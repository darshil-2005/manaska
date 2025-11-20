import { eq } from "drizzle-orm";

import { db } from "../../db/db";
import { userAPIKeys } from "../../db/schema";

export const USER_KEY_NOT_FOUND = "USER_KEY_NOT_FOUND";
export const DEFAULT_KEY_NOT_CONFIGURED = "DEFAULT_KEY_NOT_CONFIGURED";

export async function resolveGroqApiKey({ userId, useUserKey }) {
  if (useUserKey) {
    const [record] = await db
      .select({ apiKey: userAPIKeys.apiKey })
      .from(userAPIKeys)
      .where(eq(userAPIKeys.userId, userId));

    if (!record?.apiKey) {
      throw new Error(USER_KEY_NOT_FOUND);
    }

    return { apiKey: record.apiKey, source: "user" };
  }

  const defaultKey = process.env.GROQ_API_KEY;
  if (!defaultKey) {
    throw new Error(DEFAULT_KEY_NOT_CONFIGURED);
  }

  return { apiKey: defaultKey, source: "default" };
}
