
import {auth } from "../../auth.ts";

export function getUser() {

  const info  = auth();
  console.log("Auth: ", info);

  return info
}
