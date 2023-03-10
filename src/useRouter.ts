import { RouterEngineInterface } from "./routing";
import { History, HistoryInterface } from "./history";
import { createContext, useContext } from "react";

export type RouterContextValue = {
  router: RouterEngineInterface
  history: HistoryInterface,
}

export const RouterContext = createContext<RouterContextValue>({} as any);

export const useRouter = () => useContext(RouterContext);
