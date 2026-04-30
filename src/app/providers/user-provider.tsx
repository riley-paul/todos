import type { UserSelect } from "@/lib/types2";
import { createContext, useContext } from "react";

type Value = { user: UserSelect };

const userContext = createContext<Value | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<Value>> = ({
  user,
  children,
}) => {
  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(userContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context.user;
};
