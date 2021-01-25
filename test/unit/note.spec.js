'use strict'

const { test } = use('Test/Suite')('Note')

test('Must Throw Exception', async ({ assert }) => {
  // assert.equal(2 + 2, 4)
  // assert.plan(1)

  try {
    await badOperation()
  } catch ({ message }) {
    assert.equal(message, 'badOperation is not defined')
  }
})
