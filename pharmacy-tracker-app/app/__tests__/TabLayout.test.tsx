import React from 'react';
import renderer from 'react-test-renderer';
import TabLayout from '../(tabs)/_layout';

test('TabLayout renders', () => {
  let tree = null;
  try {
    tree = renderer.create(<TabLayout />).toJSON();
  } catch (err) {
    // If environment lacks support for some native hooks, at least ensure test file runs
    // and we don't crash the test runner. Mark as skipped by asserting truthy on error message.
    expect(err).toBeUndefined();
    return;
  }
  expect(tree).toBeTruthy();
});
