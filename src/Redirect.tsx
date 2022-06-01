import React, { FC, useLayoutEffect } from "react";
import { RouterHelper, useRouter } from "./hook";

export type RedirectProps = {
  to: string
  params?: object
  query?: object
}

export const Redirect: FC<RedirectProps> = ({
  to,
  params,
  query,
}): null => {
  const router: RouterHelper = useRouter();

  useLayoutEffect((): void => {
    router.redirectTo(to, params, query);
  }, [to, params, query]);

  return null;
};
