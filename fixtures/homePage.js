export class HomePage {
  /**
   * param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    this.searchBar = this.page.getByRole('search')
    this.searchButton = this.page.getByTestId('search-input').getByLabel('検索', { exact: true })
    this.searchInput = this.page.getByLabel('検索キーワードを入力')
    this.searchByCat = this.page.getByRole('link', {name: 'カテゴリーからさがす', exact: true})
  }

  async goto() {
    await this.page.goto('/')
  }

  /**
   * param {string} text
   */
  async searchByKeyword(text) {
    await this.searchInput.fill(text)
    await this.searchButton.click()
  }

  async openSearchComponent() {
    await this.searchBar.click()
  }

  async searchByCategory() {
    await this.searchBar.click()
    await this.searchByCat.click()
  }
}