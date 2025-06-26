const t = this

it('`this` in cjs should be exports', () => {
  // TODO: This is WRONG, it should be undefined
  expect(t).toBe(exports)
})

// Use a dummy assignment to ensure we are parsed as a cjs module
exports.something = 'something'
