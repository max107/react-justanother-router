import React, { FC, HTMLProps, MouseEvent, PropsWithChildren, useCallback } from "react";
import { RedirectProps, useRouter } from ".";

export type LinkProps = RedirectProps & {
  className?: string
  onClick?: any
} & HTMLProps<HTMLAnchorElement>

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  to,
  params = {},
  query = {},
  children,
  onClick,
  ...rest
}): JSX.Element => {
  const { urlFor, redirectTo } = useRouter();

  const handleClick = useCallback((e: MouseEvent<HTMLElement>): void => {
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
      onClick && onClick(e);
    }

    redirectTo(to, params, query);
  }, [onClick, to, params, query]);

  return (
    <a {...rest} onClick={handleClick} href={urlFor(to, params, query)}>
      {children}
    </a>
  );
};
