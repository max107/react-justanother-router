import { match, Match, parse, Token, } from "path-to-regexp";
import { buildFrom, cleanPath, splitUri, UriPart, } from "./utils";
import { CompiledRoute, MatchFunction, RouteProps, RouteRenderFunction, UrlForFunction } from "./types";

export const buildRoutes = (routes: Route[], parentUri = '/'): CompiledRoute[] => {
  const result: CompiledRoute[] = [];

  for (let i = 0; i < routes.length; i++) {
    const { children, ...route }: Route = routes[i];

    const path = route.path
      ? cleanPath([parentUri, route.path || ''].join('/'))
      : parentUri;

    if (Array.isArray(children) && children.length > 0) {
      result.push(...buildRoutes(children, path));
    }

    if (route.render) {
      result.push({
        name: route.name,
        render: route.render,
        path,
        props: route.props || {},
        route: {
          match: match(path),
          tokens: parse(path).slice(1),
        }
      });
    }
  }

  return result;
};

export type Route = {
  name?: string
  path?: string
  props?: RouteProps
  render?: RouteRenderFunction
  children?: Route[]
}

export type RouteMatchQ<T = {}> = {
  props: T;
  render?: any // Function
  name?: string
  params: object
  query: object
}

export type RouteMatch<T = any> = {
  render?: any // Function
  name?: string
  params: object
  query: object
} & (T extends undefined ? {
  props: {},
} : {
  props: T;
})

export interface RouterEngineInterface {
  match: MatchFunction;
  urlFor: UrlForFunction;
}

export class RouterEngine implements RouterEngineInterface {
  private readonly routes: CompiledRoute[] = [];

  /**
   * @param routes
   */
  constructor(routes: Route[]) {
    this.routes = buildRoutes(routes);
  }

  /**
   * @param uri
   */
  match(uri: string): RouteMatch | null {
    for (let i = 0; i < this.routes.length; i++) {
      const route: CompiledRoute = this.routes[i];
      const parts: UriPart = splitUri(uri);
      const result: Match = route.route.match(parts.uri);

      if (result) {
        return {
          name: route.name,
          render: route.render,
          params: result.params,
          query: parts.search,
          props: route.props,
        };
      }
    }

    return null;
  }

  getRoutes(): CompiledRoute[] {
    return this.routes;
  }

  /**
   * @param name
   */
  private findRoute(name: string): CompiledRoute | null {
    for (let i = 0; i < this.routes.length; i++) {
      if (this.routes[i].name === name) {
        return this.routes[i];
      }
    }

    return null;
  }

  /**
   * @param name
   * @param tokens
   * @param params
   */
  private validate(name: string, tokens: Token[], params: object = {}): void {
    const parameterNames: (string | number)[] = Object.keys(params);
    const tokenNames: (string | number)[] = tokens
      .slice(0, tokens.length - 1)
      .map((token: Token) => typeof token === 'object' ? token.name : token)
      .filter((t: string | number) => !String(t).startsWith('/'));

    const diffTokens: (string | number)[] = tokenNames.filter((i: string | number) => parameterNames.indexOf(i) < 0);

    if (diffTokens.length > 0) {
      throw new Error(`Missing required parameters for ${name}: ${diffTokens.join(', ')}`);
    }
  }

  urlFor<P extends object>(name: string, params?: P, query?: object): string {
    const route: CompiledRoute | null = this.findRoute(name);
    if (null === route) {
      throw new Error(`route ${name} not found`);
    }

    this.validate(name, route.route.tokens, params);

    return buildFrom(route.path, params, query);
  }
}
