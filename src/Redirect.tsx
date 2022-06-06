import React, { FC, useLayoutEffect } from "react";
import { useRouter } from "./context";

export type RedirectProps = {
  to: string
  params?: object
  query?: object
  replace?: boolean
}

export const Redirect: FC<RedirectProps> = ({
  to,
  params,
  query,
  replace,
}): null => {
  const { replaceTo, redirectTo } = useRouter();

  useLayoutEffect(() => {
    if (replace) {
      replaceTo(to, params, query);
    } else {
      redirectTo(to, params, query);
    }
  }, [to, params, query, replace]);

  return null;
};
