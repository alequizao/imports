import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import type { Product, Review } from '@/lib/types';
import type { RowDataPacket, OkPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const [productRows] = await pool.query<RowDataPacket[]>(
        'SELECT id, name, description, price, image, category, color, size, model, stock, discountPrice FROM products WHERE id = ?',
        [id]
      );

      if (productRows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const productData = productRows[0];

      const [reviewRows] = await pool.query<RowDataPacket[]>(
        'SELECT id, productId, author, rating, comment, date, userId FROM reviews WHERE productId = ? ORDER BY date DESC',
        [id]
      );

      const product: Product = {
        ...productData,
        price: parseFloat(productData.price as string),
        discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice as string) : undefined,
        stock: parseInt(productData.stock as string, 10),
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

      res.status(200).json(product);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      res.status(500).json({ message: `Failed to fetch product ${id}`, error: (error as Error).message });
    }
  } else if (req.method === 'PUT') {
    try {
      const productData = req.body as Partial<Omit<Product, 'id'>>;
      const { name, description, price, image, category, color, size, model, stock, discountPrice } = productData;

      // Construct SET clause dynamically for fields that are actually provided
      const fieldsToUpdate: { [key: string]: any } = {};
      if (name !== undefined) fieldsToUpdate.name = name;
      if (description !== undefined) fieldsToUpdate.description = description;
      if (price !== undefined) fieldsToUpdate.price = price;
      if (image !== undefined) fieldsToUpdate.image = image;
      if (category !== undefined) fieldsToUpdate.category = category;
      if (color !== undefined) fieldsToUpdate.color = color;
      if (size !== undefined) fieldsToUpdate.size = size;
      if (model !== undefined) fieldsToUpdate.model = model;
      if (stock !== undefined) fieldsToUpdate.stock = stock;
      if (discountPrice !== undefined) fieldsToUpdate.discountPrice = discountPrice;
      else if (productData.hasOwnProperty('discountPrice') && discountPrice === null) { // Allow setting discountPrice to null
        fieldsToUpdate.discountPrice = null;
      }


      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }
      
      fieldsToUpdate.updated_at = new Date(); // Update the timestamp

      const setClause = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(fieldsToUpdate), id];

      const [result] = await pool.execute<OkPacket>(
        `UPDATE products SET ${setClause} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 1) {
         // Fetch the updated product to return it
        const [updatedProductRows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
        if (updatedProductRows.length > 0) {
            const updatedProductData = updatedProductRows[0];
             const [reviewRows] = await pool.query<RowDataPacket[]>(
                'SELECT id, productId, author, rating, comment, date, userId FROM reviews WHERE productId = ? ORDER BY date DESC',
                [id]
            );
            const fullUpdatedProduct: Product = {
                 ...updatedProductData,
                price: parseFloat(updatedProductData.price as string),
                discountPrice: updatedProductData.discountPrice ? parseFloat(updatedProductData.discountPrice as string) : undefined,
                stock: parseInt(updatedProductData.stock as string, 10),
                reviews: reviewRows.map(r => ({
                    ...r,
                    rating: parseInt(r.rating as string, 10),
                    date: new Date(r.date).toISOString(),
                } as Review)),
            } as Product;
            res.status(200).json(fullUpdatedProduct);
        } else {
             res.status(404).json({ message: 'Product not found after update' });
        }
      } else {
        res.status(404).json({ message: 'Product not found or no changes made' });
      }
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      res.status(500).json({ message: `Failed to update product ${id}`, error: (error as Error).message });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Before deleting a product, consider implications (e.g., orders referencing this product)
      // For now, we'll just delete. Foreign key constraints might prevent this if orders exist.
      // The `order_items` table has ON DELETE RESTRICT, so this will fail if orders reference it.
      // This needs to be handled or the constraint changed to ON DELETE SET NULL or similar.
      
      // First, delete associated reviews (if any) to avoid foreign key issues if product is deleted.
      // This is handled by ON DELETE CASCADE in the reviews table.

      const [result] = await pool.execute<OkPacket>('DELETE FROM products WHERE id = ?', [id]);

      if (result.affectedRows === 1) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error: any) {
      console.error(`Failed to delete product ${id}:`, error);
      if (error.code === 'ER_ROW_IS_REFERENCED_2') { // MySQL error code for foreign key constraint violation
        return res.status(400).json({ message: `Não é possível excluir o produto pois ele está referenciado em pedidos existentes.` });
      }
      res.status(500).json({ message: `Failed to delete product ${id}`, error: error.message });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
