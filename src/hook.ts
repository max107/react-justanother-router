import { useContext } from "react";
import { HistoryContext, RouterContext } from "./context";
import { RouterEngineInterface } from "./routing";
import { History, parsePath } from "./history";
import { UrlForFunction } from "./types";

export type RedirectToFunction = (routeName: string, params?: object, query?: object) => void;

export type RouterHelper = {
  redirectTo: RedirectToFunction;
  urlFor: UrlForFunction
}

const createRouterWrapper = (router: RouterEngineInterface, history: History): RouterHelper => ({
  redirectTo: (route: string, params?: object, query?: object): void => {
    history.push(parsePath(router.urlFor(route, params, query)));
  },

  urlFor: (route: string, params?: object, query?: object): string => (
    route.indexOf('/') > -1 ? route : router.urlFor(route, params, query)
  ),
});

export const useHistory = (): History => useContext<History>(HistoryContext);
export const useCoreRouter = (): RouterEngineInterface => useContext<RouterEngineInterface>(RouterContext);
export const useRouter = (): RouterHelper => createRouterWrapper(useCoreRouter(), useHistory());
