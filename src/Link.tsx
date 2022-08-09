import React, { FC, HTMLProps, MouseEvent, PropsWithChildren, useCallback } from "react";
import { RedirectProps, useNavigate } from ".";

export type LinkProps = RedirectProps & HTMLProps<HTMLAnchorElement>

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  to,
  params = {},
  query = {},
  children,
  replace,
  onClick,
  ...rest
}): JSX.Element => {
  const { urlFor, navigate } = useNavigate();

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>): void => {
    // ignores the navigation when clicked using right mouse button or
    // by holding a special modifier key: ctrl, command, win, alt, shift
    if (e) {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||
        e.button !== 0
      ) {
        return;
      }

      e.preventDefault();
    }

    if (onClick) {
      onClick(e);
    }

    navigate(to, params, query, replace);
  }, [onClick, to, params, query, replace]);

  return (
    <a {...rest} onClick={handleClick} href={urlFor(to, params, query)}>
      {children}
    </a>
  );
};
