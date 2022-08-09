import '@testing-library/jest-dom';
import * as React from "react";
import { createHistory, History, HistoryLocation, Link, RendererFunction, Router, RouterEngine, } from "../src";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

test('Link', async () => {
  const locations: HistoryLocation[] = [];
  const history: History = createHistory();
  history.listen((location) => locations.push(location));
  expect(locations.length).toEqual(0);

  const user = userEvent.setup();

  const renderer: RendererFunction = ({ component, ...rest }) => React.createElement(component, rest);
  const fn = jest.fn();
  const router = new RouterEngine([
    {
      name: 'homepage',
      path: '/',
      component: () => <Link id="foobar_link" to='foobar' onClick={fn}>go to foobar</Link>
    },
    {
      name: 'foobar',
      path: '/foobar',
      component: () => <main data-id="foobar_content">hey</main>
    },
  ]);
  render((
    <Router
      history={history}
      router={router}
      renderer={renderer}
    />
  ));
  expect(screen.getByText(/go to foobar/i)).toBeInTheDocument();
  await user.click(screen.getByText(/go to foobar/i));
});
