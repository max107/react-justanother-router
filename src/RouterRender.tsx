import React, { FC } from "react";
import { CurrentRouteContext, locationToString, RouterEngineInterface, RouterProps } from ".";
import { useLocation } from "./useLocation";

export const RouterRender: FC<RouterProps & { router: RouterEngineInterface }> = ({
  renderer,
  router,
}) => {
  const location = useLocation();

  const route = router.match(locationToString(location));
  if (route === null) {
    return null;
  }

  const content = renderer(route);

  return (
    <CurrentRouteContext.Provider value={{ currentRoute: route }}>
      {content}
    </CurrentRouteContext.Provider>
  )
};
