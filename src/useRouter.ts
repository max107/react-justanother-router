import { RouteMatch, RouterEngineInterface } from "./routing";
import { HistoryInterface } from "./history";
import { createContext, useContext } from "react";

export type RouterContextValue = {
  router: RouterEngineInterface
  history: HistoryInterface
}

export const RouterContext = createContext<RouterContextValue>({} as any);

export const useRouter = () => useContext(RouterContext);

export type CurrentRouteContextValue = {
  currentRoute: RouteMatch
}

export const CurrentRouteContext = createContext<CurrentRouteContextValue>({} as any);

export const useCurrentRoute = () => {
  return useContext(CurrentRouteContext);
}
