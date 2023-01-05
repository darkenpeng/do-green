import { CategoryRepository } from './category.repository';

const categoryRepository = new CategoryRepository();

export class CategoryService {
  async updateCategory(data: updateCategoryDto, categoryId: string) {
    const { categoryName, mascotName, mascotImage } = data;

    // 비교
    const toUpdate = {
      ...(categoryName && { categoryName }),
      ...(mascotName && { mascotName }),
      ...(mascotImage && { mascotImage })
    };
    await categoryRepository.updateOneCategory(toUpdate, categoryId);
  }

  async isCategoryExists(categoryId: string) {
    return categoryRepository.isCategoryExists(categoryId);
  }

  async deleteOneCategory(categoryId: string) {
    await categoryRepository.deleteOneCategory(categoryId);
  }

  async findAllCategory() {
    const allCategory = await categoryRepository.findAllCategory();
    return allCategory;
  }

  async findCategoryByIds(categoryIds: string[]) {
    return categoryRepository.findCategoryByIds(categoryIds);
  }

  async findOneCategory(categoryId: string) {
    const oneCategory = await categoryRepository.findOneCategory(categoryId);
    return oneCategory;
  }

  async createCategory(newCategory: createCategoryDto) {
    await categoryRepository.createOneCategory(newCategory);
  }
}
