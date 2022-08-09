import { match, Match, MatchFunction as RegexMatchFunction, parse, Token, } from "path-to-regexp";
import { buildFrom, cleanPath, ParsedHistoryLocation, splitUri, } from "./utils";

export type UrlForFunction = (name: string, params?: object, query?: object) => string;

export type MatchFunction<T extends any> = (uri: string) => RouteMatch<T> | null;

export type RouteRenderFunction = any;

export type DynamicProps<T = any> = {
  props?: any;
} | {
  props?: T;
}

export type CompiledRoute<T = any> = DynamicProps<T> & {
  name?: string
  path: string
  component: RouteRenderFunction
  route: {
    match: RegexMatchFunction
    tokens: Token[]
  }
};

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

    if (route.component) {
      const { name, component, props } = route;

      const target: CompiledRoute<T> = {
        name,
        component,
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

export type Route<T = any> = DynamicProps<T> & {
  name?: string
  path?: string
  component?: RouteRenderFunction
  children?: Route<T>[]
};

export type RouteMatch<T = any> = DynamicProps<T> & {
  name?: string
  path?: string
  component?: any // Function
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
      const parts: ParsedHistoryLocation = splitUri(uri);
      const result: Match = route.route.match(parts.pathname);

      if (result) {
        return {
          name: route.name,
          component: route.component,
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

  urlFor<P extends object = {}>(name: string, params?: P, query?: object): string {
    const route: CompiledRoute<T> | null = this.findRoute(name);
    if (null === route) {
      throw new Error(`route ${name} not found`);
    }

    this.validate(name, route.route.tokens, params);

    return buildFrom(route.path, params, query);
  }
}
