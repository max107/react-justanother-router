import React, { FC } from "react";
import { locationToString, PartialPath, RouterEngineInterface, RouterProps } from ".";

export const RouterRender: FC<RouterProps & { location: PartialPath, router: RouterEngineInterface }> = ({
  renderer,
  router,
  location,
}): JSX.Element | null => {
  const route = router.match(locationToString(location));
  if (route === null) {
    return null;
  }

  return renderer(route);
};
