import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { createContextValue, Location, RouterContext, RouterProviderProps, Unlisten, Update } from ".";
import { RouterRender } from "./RouterRender";

export const Router: FC<PropsWithChildren<RouterProviderProps>> = ({
  router,
  history,
  children,
  renderer,
}): JSX.Element | null => {
  let unlisten: Unlisten = undefined;

  const [location, setLocation] = useState<Location>(() => {
    // ugly hook: emulate component will mount
    unlisten = history.listen(({ location }: Update) => {
      setLocation(location);
    });

    return history.location;
  });

  useEffect(() => {
    return () => unlisten && unlisten();
  }, []);

  return (
    <RouterContext.Provider value={createContextValue(history, router)}>
      <RouterRender router={router} renderer={renderer} location={location}/>
      {children}
    </RouterContext.Provider>
  );
};
