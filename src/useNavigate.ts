import { useCallback } from "react";
import { useRouter } from "./useRouter";

export const useNavigate = () => {
  const { router, history } = useRouter();

  const urlFor = useCallback((route: string, params?: object, query?: object): string => (
    route.indexOf('/') > -1 ? route : router.urlFor(route, params, query)
  ), [router]);

  const navigate = (
    route: string,
    params?: object,
    query?: object,
    replace?: boolean,
    scrollToTop = true,
  ) => {
    if (scrollToTop && typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
      });
    }
    history.navigate(urlFor(route, params, query), replace);
  };

  return {
    navigate,
    urlFor
  };
};
