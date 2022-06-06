import { match, Match, parse, Token, } from "path-to-regexp";
import { buildFrom, cleanPath, splitUri, UriPart, } from "./utils";
import { CompiledRoute, DynamicProps, MatchFunction, RouteRenderFunction, UrlForFunction } from ".";

export function buildRoutes<T = any>(routes: Route<T>[], parentUri = '/'): CompiledRoute<T>[] {
  const result: CompiledRoute<T>[] = [];

  for (let i = 0; i < routes.length; i++) {
    const { children, ...route } = routes[i];

    const path = route.path
      ? cleanPath([parentUri, route.path || ''].join('/'))
      : parentUri;

    if (Array.isArray(children) && children.length > 0) {
      result.push(...buildRoutes<T>(children, path));
    }

    if (route.render) {
      const { name, render, props } = route;

      const target: CompiledRoute<T> = {
        name,
        render,
        path,
        props,
        route: {
          match: match(path),
          tokens: parse(path).slice(1),
        }
      };

      result.push(target);
    }
  }

  return result;
}

// type RoutePart<T = any> = {
//   name?: string
//   path?: string
//   props?: any;
// };

export type Route<T = any> = DynamicProps<T> & {
  name?: string
  path?: string
  render?: RouteRenderFunction
  children?: Route<T>[]
};

export type RouteMatch<T = any> = DynamicProps<T> & {
  name?: string
  path?: string
  render?: any // Function
  params: object
  query: object
};

export interface RouterEngineInterface<T = any> {
  match: MatchFunction<T>;
  urlFor: UrlForFunction;
}

export class RouterEngine<T = any> implements RouterEngineInterface<T> {
  private readonly routes: CompiledRoute<T>[] = [];

  /**
   * @param routes
   */
  constructor(routes: Route<T>[]) {
    this.routes = buildRoutes(routes);
  }

  /**
   * @param uri
   */
  match(uri: string): RouteMatch<T> | null {
    for (let i = 0; i < this.routes.length; i++) {
      const route: CompiledRoute<T> = this.routes[i];
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

  getRoutes(): CompiledRoute<T>[] {
    return this.routes;
  }

  /**
   * @param name
   */
  private findRoute(name: string): CompiledRoute<T> | null {
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
    const route: CompiledRoute<T> | null = this.findRoute(name);
    if (null === route) {
      throw new Error(`route ${name} not found`);
    }

    this.validate(name, route.route.tokens, params);

    return buildFrom(route.path, params, query);
  }
}
