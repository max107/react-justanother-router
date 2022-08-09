import React, { FC } from "react";
import { locationToString, RouterEngineInterface, RouterProps } from ".";
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

  return renderer(route);
};
