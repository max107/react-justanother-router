import { RouterEngineInterface } from "./routing";
import React, { FC, HTMLProps, MouseEvent, PropsWithChildren, useCallback } from "react";
import { useCoreRouter, useHistory } from "./hook";
import { History, parsePath } from './history';
import { RedirectProps } from "./Redirect";

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
  const router: RouterEngineInterface = useCoreRouter();
  const history: History = useHistory();

  const url = to.indexOf('/') > -1 ? to : router.urlFor(to, params, query);

  const handleClick = useCallback((event: MouseEvent<HTMLElement>): void => {
    // ignores the navigation when clicked using right mouse button or
    // by holding a special modifier key: ctrl, command, win, alt, shift
    if (event) {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
    }

    if (onClick) {
      onClick && onClick(event);
    }

    history.push(parsePath(url));
  }, [onClick, url]);

  return (
    <a {...rest} onClick={handleClick} href={url}>
      {children}
    </a>
  );
};
