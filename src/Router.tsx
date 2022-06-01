import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { RouteMatch, RouterEngineInterface } from "./routing";
import { History, Location, Update } from "./history";
import { useCoreRouter, useHistory } from "./hook";
import { RendererFunction } from "./types";
import { copyLocation, locationToString } from "./utils";

export const match = (
  uri: string,
  router: RouterEngineInterface,
  renderer: RendererFunction,
): any => {
  const route: RouteMatch | null = router.match(uri);
  if (route === null) {
    return null;
  }

  return renderer(route);
};

type RouterProps<T = any> = {
  renderer: RendererFunction<T>;
}

export const Router: FC<RouterProps> = ({
  renderer,
}): JSX.Element | null => {
  const history: History = useHistory();
  const router: RouterEngineInterface = useCoreRouter();

  const [location, setLocation] = useState<Location>(
    copyLocation(history.location)
  );
  const [component, setComponent] = useState<JSX.Element | null>(
    match(locationToString(location), router, renderer)
  );

  useLayoutEffect(() => history.listen(({ location }: Update): void => {
    setLocation(copyLocation(location));
  }), [location]);

  useEffect(() => {
    setComponent(match(locationToString(location), router, renderer));
  }, [location]);

  return component;
};
