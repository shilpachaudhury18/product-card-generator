import { Router } from 'express';
import { generateProduct } from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { productInput } from '../schemas/productSchema.js';
import type { Generator } from '../services/geminiService.js';

export function productRoutes(generator: Generator) {
  const router = Router();
  router.post('/generate', validate(productInput), generateProduct(generator));
  return router;
}
