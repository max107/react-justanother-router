import qs from "qs";
import { Location } from "./history";
import { compile } from "path-to-regexp";

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

export const copyLocation = ({ search, pathname, state }: Location): Location => ({
  search,
  pathname,
  state,
  hash: "",
  key: "",
});

export const locationToString = ({ pathname, search }: Location): string => [
  pathname,
  search.substring(1)
].filter((t) => t).join("?");
