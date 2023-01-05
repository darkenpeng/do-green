import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.serivce';

const categoryService = new CategoryService();

export class CategoryController {
  async updateCategory(req:Request, res:Response) {
    await categoryService.updateCategory(req.body, req.params.id);
    res.status(200).end();
  }

  async createCategory(req: Request, res: Response) {
    const newCategory = req.body;
    await categoryService.createCategory(newCategory);
    res.status(201).end();
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    await categoryService.deleteOneCategory(id);
    res.status(204).end();
  }

  async findOneCategory(req: Request, res: Response) {
    const { id } = req.params;
    const oneCategory = await categoryService.findOneCategory(id);
    res.status(200).json(oneCategory);
  }

  async findAllCategory(req: Request, res: Response) {
    const allCategory = await categoryService.findAllCategory();
    res.status(200).json(allCategory);
  }
};
