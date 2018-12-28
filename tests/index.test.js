import { parse } from 'src/index.js'

it('should init success', () => {
  const str = `
  {
    "name": "jsoner",
    "private": true,
    "version": "0.0.1",
    "main": "dist/index.js",
    "source": "src/index.js",
    "repository": "https://github.com/Himself65/jsoner.git",
    "author": "himself65 <himself6565@gmail.com>",
    "license": "MIT"
  }
  `
  const res = parse(str)
  expect(res.name).toBe('jsoner')
  expect(res.private).toBeTruthy()
  expect(res.version).toBe('0.0.1')
  expect(res.main).toBe('dist/index.js')
})
