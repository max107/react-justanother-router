import React, { FC, PropsWithChildren, useRef } from "react";
import { RouterEngineInterface } from "./routing";
import { History } from "./history";
import { HistoryContext, RouterContext } from "./context";

export type RouterProviderProps = {
  router: RouterEngineInterface;
  history: History;
}

export const RouterProvider: FC<PropsWithChildren<RouterProviderProps>> = ({
  router,
  history,
  children,
}): JSX.Element => {
  const routerRef = useRef<RouterEngineInterface | null>(router);
  const historyRef = useRef<History | null>(history);

  // this little trick allows to avoid having unnecessary
  // calls to potentially expensive `buildRouter` method.
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  router = routerRef.current || (routerRef.current = router);
  history = historyRef.current || (historyRef.current = history);

  return (
    <HistoryContext.Provider value={history}>
      <RouterContext.Provider value={router}>
        {children}
      </RouterContext.Provider>
    </HistoryContext.Provider>
  );
};
