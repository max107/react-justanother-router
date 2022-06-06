import { createContext, useContext } from "react";
import { History, PartialPath, RouterEngineInterface } from ".";

export type UrlForFunction = (name: string, params?: object, query?: object) => string;

export type RedirectToFunction = (routeName: string, params?: object, query?: object) => void;

export type HistoryReducerContext = {
  location: PartialPath
}

export type RouterContextValue = {
  router: RouterEngineInterface
  history: History,
} & HistoryReducerContext & {
  // utils
  replaceTo: RedirectToFunction;
  redirectTo: RedirectToFunction;
  urlFor: UrlForFunction
}

export const RouterContext = createContext<RouterContextValue>({} as any);

export const useRouter = () => useContext(RouterContext);
