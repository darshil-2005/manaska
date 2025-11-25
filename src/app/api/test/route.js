
import {auth} from "../../../../auth.ts"

export async function POST(request) {
  
  const user = await auth(request);

  console.log("Hello: ", user);
  return new Response(
    JSON.stringify({ error: "Failed to resolve API key" }),
    { status: 500 }
  );
 
}
