import type { UserSelect, UserSessionInfo } from "@/lib/types";
import { createContext, useContext } from "react";

type Value = { user: UserSelect; userSession: UserSessionInfo };
type Props = React.PropsWithChildren<Value>;

const userContext = createContext<Value | undefined>(undefined);

export const UserProvider: React.FC<Props> = ({ children, ...rest }) => {
  return <userContext.Provider value={rest}>{children}</userContext.Provider>;
};

export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
};

export const useUserSession = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserProvider");
  }
  return context.userSession;
};
