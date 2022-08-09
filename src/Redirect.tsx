import React, { FC, useLayoutEffect } from "react";
import { useNavigate } from "./useNavigate";

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
  const { navigate } = useNavigate();

  useLayoutEffect(() => {
    navigate(to, params, query, replace);
  }, [to, params, query, replace]);

  return null;
};
