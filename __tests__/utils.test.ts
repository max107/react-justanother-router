import { buildUri, cleanPath, locationToString, splitUri } from "../src";
import { Location } from "../src";

test('locationToString', async () => {
  const defaultLocation: Location = {
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
