/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { Review } from '@/lib/types';
import type { OkPacket, RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: productId } = req.query;

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  if (req.method === 'POST') {
    try {
      const { author, rating, comment, userId } = req.body as Omit<Review, 'id' | 'date' | 'productId'> & { userId?: string };
      
      if (!author || !rating || !comment) {
        return res.status(400).json({ message: 'Author, rating, and comment are required for a review.' });
      }
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
      }


      const reviewId = uuidv4();
      const reviewDate = new Date(); // Use current date for the review

      const [result] = await pool.execute<OkPacket>(
        'INSERT INTO reviews (id, productId, author, rating, comment, userId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [reviewId, productId, author, rating, comment, userId || null, reviewDate]
      );

      if (result.affectedRows === 1) {
        const newReview: Review = {
          id: reviewId,
          productId,
          author,
          rating,
          comment,
          date: reviewDate.toISOString(),
          userId: userId || undefined,
        };
        res.status(201).json(newReview);
      } else {
        res.status(500).json({ message: 'Failed to add review' });
      }
    } catch (error) {
      console.error(`Failed to add review to product ${productId}:`, error);
      res.status(500).json({ message: `Failed to add review to product ${productId}`, error: (error as Error).message });
    }
  } else if (req.method === 'GET') {
    try {
        const [reviewRows] = await pool.query<RowDataPacket[]>(
            'SELECT id, productId, author, rating, comment, date, userId FROM reviews WHERE productId = ? ORDER BY date DESC',
            [productId]
        );
        
        const reviews: Review[] = reviewRows.map(r => ({
            ...r,
            id: r.id,
            productId: r.productId,
            author: r.author,
            rating: parseInt(r.rating as string, 10),
            comment: r.comment,
            date: new Date(r.date).toISOString(),
            userId: r.userId,
        } as Review));

        res.status(200).json(reviews);

    } catch (error) {
        console.error(`Failed to fetch reviews for product ${productId}:`, error);
        res.status(500).json({ message: `Failed to fetch reviews for product ${productId}`, error: (error as Error).message });
    }
  }
  else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
