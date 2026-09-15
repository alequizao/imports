/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { Product, Review } from '@/lib/types';
import type { RowDataPacket, OkPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [productRows] = await pool.query<RowDataPacket[]>(
        'SELECT id, name, description, price, image, category, color, size, model, stock, discountPrice FROM products ORDER BY created_at DESC'
      );

      const productsWithReviews: Product[] = await Promise.all(
        productRows.map(async (product) => {
          const [reviewRows] = await pool.query<RowDataPacket[]>(
            'SELECT id, productId, author, rating, comment, date, userId FROM reviews WHERE productId = ? ORDER BY date DESC',
            [product.id]
          );
          return {
            ...product,
            price: parseFloat(product.price as string),
            discountPrice: product.discountPrice ? parseFloat(product.discountPrice as string) : undefined,
            stock: parseInt(product.stock as string, 10),
            reviews: reviewRows.map(r => ({
              ...r,
              id: r.id,
              productId: r.productId,
              author: r.author,
              rating: parseInt(r.rating as string, 10),
              comment: r.comment,
              date: new Date(r.date).toISOString(),
              userId: r.userId,
            } as Review)),
          } as Product;
        })
      );
      res.status(200).json(productsWithReviews);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      res.status(500).json({ message: 'Failed to fetch products', error: (error as Error).message });
    }
  } else if (req.method === 'POST') {
    try {
      const productData = req.body as Omit<Product, 'id' | 'reviews'>; // Reviews are handled separately
      const { name, description, price, image, category, color, size, model, stock, discountPrice } = productData;
      const id = uuidv4();

      const [result] = await pool.execute<OkPacket>(
        'INSERT INTO products (id, name, description, price, image, category, color, size, model, stock, discountPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, description, price, image || `https://picsum.photos/seed/${id}/400/300`, category, color, size, model, stock, discountPrice ?? null]
      );

      if (result.affectedRows === 1) {
        const newProduct: Product = { 
            id, 
            ...productData, 
            reviews: [], // New products start with no reviews
            image: image || `https://picsum.photos/seed/${id}/400/300`,
            discountPrice: discountPrice ?? undefined 
        };
        res.status(201).json(newProduct);
      } else {
        res.status(500).json({ message: 'Failed to add product' });
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      res.status(500).json({ message: 'Failed to add product', error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
