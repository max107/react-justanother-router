import { useEffect, useMemo, useState } from "react";
import { HistoryLocation } from "./history";
import { useRouter } from "./useRouter";
import { locationIsEqual } from "./utils";

export const useLocation = (): HistoryLocation => {
  const { history } = useRouter();

  const [location, setLocation] = useState<HistoryLocation>(() => history.location);
  useEffect(() => history.listen(newLocation => {
    if (locationIsEqual(location, newLocation)) {
      return;
    }
    console.log({ newLocation });
    setLocation(newLocation);
  }), [location]);

  return useMemo(() => location, [location]);
};
