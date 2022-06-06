import { MatchFunction as RegexMatchFunction, Token } from "path-to-regexp";
import { RouteMatch, RouterEngineInterface, History } from ".";

export type DynamicProps<T = any> = {
  props?: any;
} | {
  props?: T;
}

export type RouteRenderFunction = any;

export type CompiledRoute<T = any> = DynamicProps<T> & {
  name?: string
  path: string
  render: RouteRenderFunction
  route: {
    match: RegexMatchFunction
    tokens: Token[]
  }
};

export type MatchFunction<T extends any> = (uri: string) => RouteMatch<T> | null;

export type RouterProps<T = any> = {
  renderer: RendererFunction<T>;
}

export type RouterProviderProps<T = any> = RouterProps<T> & {
  router: RouterEngineInterface;
  history: History;
}

export type RendererFunction<T = any> = (match: RouteMatch<T>) => JSX.Element | null;

export type Unlisten = undefined | (() => void);
