-- Primeiro, vamos adicionar a foreign key que está faltando
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;