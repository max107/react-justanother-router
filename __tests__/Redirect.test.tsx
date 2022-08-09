import '@testing-library/jest-dom';
import * as React from "react";
import {
  createHistory,
  History,
  HistoryLocation,
  Redirect,
  RendererFunction,
  Router,
  RouterEngine,
  RouterEngineInterface,
} from "../src";
import { render } from "@testing-library/react";

test('Redirect', async () => {
  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));

  expect(locations.length).toEqual(0);
  const renderer: RendererFunction = ({ component, ...rest }) => React.createElement(component, rest);
  const router: RouterEngineInterface = new RouterEngine([
    { name: 'homepage', path: '/', component: () => <Redirect to='foobar'/> },
    { name: 'foobar', path: '/foobar', component: () => <div>hey</div> },
  ]);
  render(
    <Router history={history} router={router} renderer={renderer}/>
  );
  expect(history.location.pathname).toBe('/foobar');
  expect(locations.length).toEqual(1);
});
