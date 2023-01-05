import { Request } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';
import { BadRequestError } from '../errors/BadRequestError';

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  return schema.parseAsync(req)
    .catch(error => {
      if (error instanceof ZodError) {
        throw new BadRequestError(error.message);
      }
      throw new BadRequestError(JSON.stringify(error));
    });
}
