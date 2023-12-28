import { createContext, useContext } from "react";
import { Session } from "../auth.server";

export const SessionContext = createContext<Session | null>(null);

export function useSession() {
  return useContext(SessionContext);
}
