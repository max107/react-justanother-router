import qs from "qs";
import { History, PartialPath } from "./history";
import { compile } from "path-to-regexp";
import { RouterEngineInterface } from "./routing";
import { RouterContextValue } from "./context";

/**
 * Clean path by stripping subsequent "//"'s. Without this
 * the user must be careful when to use "/" or not, which leads
 * to bad UX.
 */
export const cleanPath = (path: string): string => (
  path.replace(/\/\/+/g, '/')
);

export const buildUri = (uri: string, query: object = {}): string => (
  Object.keys(query).length > 0 ? `${uri}?${qs.stringify(query)}` : uri
);

export function buildFrom<P extends object>(path: string, params?: P, query?: object): string {
  return buildUri(compile<P>(path)(params), query);
}

export type UriPart = {
  uri: string
  search: object
}

/**
 * Parse uri string into string before ? and search object after ?
 * @param uri
 */
export const splitUri = (uri: string): UriPart => {
  const parts: string[] = uri.split('?').filter((f: string) => f);

  return {
    uri: parts.length > 0 ? parts[0] : '',
    search: qs.parse(parts[1] ? parts[1] : ''),
  };
};

export const locationIsEqual = (a: PartialPath, b: PartialPath): boolean => (
  a.search === b.search &&
  a.pathname === b.pathname &&
  a.hash === b.hash
);

export const locationToString = ({ pathname, search }: PartialPath): string => [
  pathname,
  search ? search.substring(1) : ''
].filter((t) => t).join("?");

export const createHelpers = (history: History, router: RouterEngineInterface) => ({
  redirectTo: (route: string, params?: object, query?: object): void => {
    history.push(router.urlFor(route, params, query));
  },
  replaceTo: (route: string, params?: object, query?: object): void => {
    history.replace(router.urlFor(route, params, query));
  },
  urlFor: (route: string, params?: object, query?: object): string => (
    route.indexOf('/') > -1 ? route : router.urlFor(route, params, query)
  ),
})

export const createContextValue = (history: History, router: RouterEngineInterface): RouterContextValue => ({
  history,
  router: router,
  location: history.location,
  ...createHelpers(history, router),
})
