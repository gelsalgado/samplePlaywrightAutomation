// @ts-check
const { test, expect } = require('../fixtures/fixtures')

// Labels checked if they are displayed
const strLabels = {
  lbl_categoryHeader: 'カテゴリー',
  lbl_recommendations: 'おすすめ',
  lbl_searchResults: '検索結果',
}

// Sub-categories selected
const categories = {
  level1: {name: '本・音楽・ゲーム', value: '5'},
  level2: {name: '本', value: '72'},
  level3: {name: 'コンピュータ/IT', value: '674'}
}

// Keywords used in searching
const searchKeywords = [
  'ワンピースカードゲーム',
  'javascript'
]

// Element timeout
const elementTimeout = 30000

test.describe('Search conditions are set correctly', () => {
  test.beforeEach('Go to Mercari home page', async ({ homePage }) => {
    // Load Mercari home page
    await homePage.goto()
  })

  test('Verify search conditions are set correctly when searching by categories', async ({ homePage, categoryPage, page, browserName }) => {
    // Set screenshot prefix
    const screenshotPrefix = `./screenshots/${browserName}-`

    // Click on Select by Category
    await test.step('Select Search by Category', async () => {
      await homePage.searchByCategory()
      await expect(page.getByRole('heading', {name: strLabels.lbl_categoryHeader, exact: true})).toBeVisible({timeout: elementTimeout})
    })

    // Select the Book & Games category
    await test.step(`Select "${categories.level1.name}" subcategory`, async () => {
      await categoryPage.selectSubCategory(categories.level1.name, false)
      await expect(page.getByRole('heading', {name: categories.level1.name})).toBeVisible({timeout: elementTimeout})
    })

    // Select the Books category
    await test.step(`Select "${categories.level2.name}" subcategory`, async () => {
      await categoryPage.selectSubCategory(categories.level2.name, true)
      await expect(page.getByRole('heading', {name: categories.level2.name, exact: true})).toBeVisible({timeout: elementTimeout})
    })

    // Select the Computers & Technology category
    await test.step(`Select "${categories.level3.name}" subcategory`, async () => {
      await categoryPage.selectSubCategory(categories.level3.name, false)
    })

    // Verify that the search conditions on the left side bar are set correctly
    await test.step('Verify the search conditions on the left sidebar are correct', async () => {
      await expect(page.getByRole('combobox').filter({has: page.getByRole('option', {name: categories.level1.name, exact: true})})).toHaveValue(categories.level1.value, {timeout: elementTimeout})
      await expect(page.getByRole('combobox').filter({has: page.getByRole('option', {name: categories.level2.name, exact: true})})).toHaveValue(categories.level2.value)
      await expect(page.getByTestId('check-item').filter({has: page.getByRole('checkbox', {name: categories.level3.name, exact: true})})).toBeChecked()
      await page.screenshot({path: `${screenshotPrefix}categorySearch001-searchSideBar.png`})
    })
  })
})

test.describe('Search conditions are set correctly from the latest browsing history', () => {
  test.beforeEach('Search by keyword', async ({ homePage, page }) => {
    // Load Mercari home page
    await homePage.goto()
    await expect(page.getByRole('tab', {name: strLabels.lbl_recommendations})).toBeVisible({timeout: elementTimeout})

    // Search for the something first
    await homePage.searchByKeyword(searchKeywords[0])
    await expect(page.getByRole('heading', {name: strLabels.lbl_searchResults})).toBeVisible({timeout: elementTimeout})
  })
  
  test.beforeEach('Search by categories', async ({ homePage, categoryPage, page }) => {
    // Load Mercari home page
    await homePage.goto()
    await expect(page.getByRole('tab', {name: strLabels.lbl_recommendations})).toBeVisible({timeout: elementTimeout})

    // Search by category > Books and Games > Books > Computer and Technology
    await homePage.searchByCategory()

    await categoryPage.selectSubCategory(categories.level1.name, false)
    await categoryPage.selectSubCategory(categories.level2.name, true)
    await categoryPage.selectSubCategory(categories.level3.name, false)
    await expect(page.getByRole('heading', {name: strLabels.lbl_searchResults})).toBeVisible({timeout: elementTimeout})
  })

  test.beforeEach('Go to Mercari home page', async ({ homePage, page }) => {
    // Load Mercari home page
    await homePage.goto()
    await expect(page.getByRole('tab', {name: strLabels.lbl_recommendations})).toBeVisible({timeout: elementTimeout})
  })

  test('Verify search conditions are set correctly from the latest browsing history', async ({ homePage, page, browserName }) => {
    // Set screenshot prefix
    const screenshotPrefix = `./screenshots/${browserName}-`

    // Click on the search bar
    await test.step('Click on the search bar', async () => {
      await homePage.openSearchComponent()
    })

    // Verify that there are two browsing histories
    const initSearchHistory = await test.step('Verify that there are two browsing histories', async () => {
      const initSearchHistory = await page.getByTestId('search-history')
      const initSearchHistoryCount = await initSearchHistory.getByRole('listitem').count()
      await page.screenshot({path: `${screenshotPrefix}browsingHistory001-twoHistories.png`})
      await expect(initSearchHistoryCount).toEqual(2)
      return initSearchHistory
    })

    // Verify that the most recent history is Computer and Technology
    await test.step(`Verify the latest browsing history is shown correctly as "${categories.level3.name}"`, async () => {
      await expect(initSearchHistory.getByRole('listitem').first()).toHaveText(categories.level3.name)
    })

    // Click on the latest browsing history
    await test.step('Click on the latest browsing history', async () => {
      await initSearchHistory.getByRole('listitem').first().click()
    })

    // Verify that the search conditions on the left side bar are set correctly
    await test.step('Verify the search conditions on the left sidebar are correct', async () => {
      await expect(page.getByRole('combobox').filter({has: page.getByRole('option', {name: categories.level1.name, exact: true})})).toHaveValue(categories.level1.value, {timeout: elementTimeout})
      await expect(page.getByRole('combobox').filter({has: page.getByRole('option', {name: categories.level2.name, exact: true})})).toHaveValue(categories.level2.value)
      await expect(page.getByTestId('check-item').filter({has: page.getByRole('checkbox', {name: categories.level3.name, exact: true})})).toBeChecked()
      await page.screenshot({path: `${screenshotPrefix}browsingHistory002-searchSideBar.png`})
    })

    // Input Javascript in the search bar and search with keyword
    await test.step(`Input "${searchKeywords[1]}" in the search bar and search by keyword`, async () => {
      await homePage.searchByKeyword(searchKeywords[1])
      await expect(page.getByRole('heading', {name: strLabels.lbl_searchResults})).toBeVisible({timeout: elementTimeout})
    })

    // Go back to Mercari top page
    await test.step('Go back to Mercari top page', async () => {
      await homePage.goto()
      await expect(page.getByRole('tab', {name: strLabels.lbl_recommendations})).toBeVisible({timeout: elementTimeout})
    })

    // Verify there are three browsing histories
    const modifiedSearchHistory = await test.step('Verify there are three browsing histories', async () => {
      await homePage.openSearchComponent()
      
      const modifiedSearchHistory = await page.getByTestId('search-history')
      const modifiedSearchHistoryCount = await modifiedSearchHistory.getByRole('listitem').count()

      await page.screenshot({path: `${screenshotPrefix}browsingHistory003-threeHistories.png`})
      await expect(modifiedSearchHistoryCount).toEqual(3)

      return modifiedSearchHistory
    })

    // Verify that the most recent history is Javascript, Computer and Technology
    await test.step(`Verify the latest browsing history is "${searchKeywords[1]}, ${categories.level3.name}"`, async () => {
      await expect(modifiedSearchHistory.getByRole('paragraph').first()).toHaveText(`${searchKeywords[1]}, ${categories.level3.name}`)
    })
  })
})