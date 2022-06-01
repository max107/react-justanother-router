import { buildUri, cleanPath, copyLocation, locationToString, splitUri } from "../src/utils";
import { Location, Route } from "../src";

test('copyLocation', async () => {
  const defaultLocation: Location = {
    key: 'bar',
    hash: 'foo',
    state: { a: true },
    pathname: 'b',
    search: '?c=1'
  }
  const loc: Location = copyLocation(defaultLocation);
  expect(loc).toEqual({
    key: '',
    hash: '',
    state: { a: true },
    pathname: 'b',
    search: '?c=1'
  });
});

test('locationToString', async () => {
  const defaultLocation: Location = {
    key: 'bar',
    hash: 'foo',
    state: {},
    pathname: 'b',
    search: '?c=1'
  }
  expect(locationToString(defaultLocation)).toEqual('b?c=1');
});

test('buildUri', async () => {
  expect(buildUri('b')).toEqual('b');
  expect(buildUri('b', { c: 1 })).toEqual('b?c=1');
});

test('splitUri', async () => {
  expect(splitUri('b')).toEqual({
    uri: 'b',
    search: {},
  });
  expect(splitUri('b?c=1&a=')).toEqual({
    uri: 'b',
    search: {
      a: '',
      c: '1',
    },
  });
});

test('cleanPath', async () => {
  expect(cleanPath('//a/b///c')).toEqual('/a/b/c');
});
