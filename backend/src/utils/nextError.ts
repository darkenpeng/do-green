import { Request, Response, NextFunction } from 'express';

export function nextError(
  callback: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next)
      .catch(next);
  };
}
