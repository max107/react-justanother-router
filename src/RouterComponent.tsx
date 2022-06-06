import React, { Component, PropsWithChildren } from "react";
import {
  createContextValue,
  locationToString,
  PartialPath,
  RouterContext,
  RouterProviderProps,
  Unlisten,
  Update
} from ".";
import { RouterRender } from "./RouterRender";

type RouterState = {
  location: PartialPath
}

export class RouterComponent extends Component<PropsWithChildren<RouterProviderProps>, RouterState> {
  private unlisten: Unlisten;

  constructor(props: PropsWithChildren<RouterProviderProps>) {
    super(props);
    this.state = { location: props.history.location };
  }

  componentDidMount() {
    const { history } = this.props;
    this.setState({ location: history.location });

    this.unlisten = history.listen(({ location }: Update) => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  render() {
    const { history, children, router, renderer } = this.props;
    const { location } = this.state;

    const route = router.match(locationToString(location));
    if (route === null) {
      return null;
    }

    return (
      <RouterContext.Provider value={createContextValue(history, router)}>
        <RouterRender router={router} renderer={renderer} location={location}/>
        {children}
      </RouterContext.Provider>
    );
  }
}
