import React, { FC, useEffect } from "react";
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

  useEffect(() => {
    navigate(to, params, query, replace);
  }, [to, params, query, replace]);

  return null;
};
