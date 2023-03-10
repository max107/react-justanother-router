import React, { FC, PropsWithChildren } from "react";
import { History, HistoryInterface, RouteMatch, RouterEngineInterface } from ".";
import { RouterRender } from "./RouterRender";
import { RouterContext } from "./useRouter";

export type RendererFunction<T = any> = (match: RouteMatch<T>) => JSX.Element | null;

export type RouterProps<T = any> = {
  renderer: RendererFunction<T>;
}

export type RouterProviderProps<T = any> = RouterProps<T> & {
  router: RouterEngineInterface;
  history: HistoryInterface;
}

export const Router: FC<PropsWithChildren<RouterProviderProps>> = ({
  router,
  history,
  children,
  renderer,
}) => {
  return (
    <RouterContext.Provider value={{ history, router }}>
      <RouterRender router={router} renderer={renderer}/>
      {children}
    </RouterContext.Provider>
  );
}
