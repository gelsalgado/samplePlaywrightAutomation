export class CategoryPage {
  /**
   * param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    this.subCategoryList = this.page.getByRole('listitem')
  }

  /**
   * param {string} Category Name
   * param {Boolean} Is Exact
   */
  async selectSubCategory(categoryName, isExact) {
    await this.subCategoryList.filter({has: this.page.getByRole('link', {name: categoryName, exact: isExact})}).click()
  }
}