import { MatchFunction as RegexMatchFunction, Token } from "path-to-regexp";
import { RouteMatch } from "./routing";

export type RendererFunction<T = any> = (match: RouteMatch<T>) => JSX.Element | null;

export type RouteRenderFunction = any;

export type CompiledRoute = {
  name?: string
  path: string
  render: RouteRenderFunction
  props: any,
  route: {
    match: RegexMatchFunction
    tokens: Token[]
  }
}

export type MatchFunction = (uri: string) => RouteMatch | null;

export type UrlForFunction = (name: string, params?: object, query?: object) => string;

export type RouteProps = any;
