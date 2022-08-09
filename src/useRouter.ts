import { RouterEngineInterface } from "./routing";
import { History } from "./history";
import { createContext, useContext } from "react";

export type RouterContextValue = {
  router: RouterEngineInterface
  history: History,
}

export const RouterContext = createContext<RouterContextValue>({} as any);

export const useRouter = () => useContext(RouterContext);
