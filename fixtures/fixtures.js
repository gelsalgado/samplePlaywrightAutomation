const base = require('@playwright/test')
const { HomePage } = require('./homePage')
const { CategoryPage } = require('./categoryPage')

// Extend base test by providing "homePage" and "categoryPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
exports.test = base.test.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },

  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page))
  },
})

exports.expect = base.expect