'use server'

import { supabase } from './supabase'
import { Product, Shelf, InventoryLog } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getRecentLogs() {
    const { data, error } = await supabase
        .from('inventory_logs')
        .select(`
      *,
      products (name, barcode)
    `)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) console.error('Error fetching logs:', error)
    return data || []
}

export async function getShelves() {
    const { data, error } = await supabase
        .from('shelves')
        .select('*')
        .order('code')

    if (error) console.error('Error fetching shelves:', error)
    return (data as Shelf[]) || []
}

export async function getLowStockCount() {
    const { data, error } = await supabase
        .from('products')
        .select('id, quantity, min_stock')

    if (error) {
        console.error('Error fetching low stock count:', error)
        return 0
    }

    return data?.filter(p => p.quantity <= p.min_stock).length || 0
}

export async function getLowStockProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            shelves (id, code)
        `)
        .order('quantity', { ascending: true })

    if (error) {
        console.error('Error fetching low stock products:', error)
        return []
    }

    return (data?.filter(p => p.quantity <= p.min_stock) as Product[]) || []
}

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      shelves (id, code, capacity),
      categories (id, name)
    `)
        .order('name')

    if (error) console.error('Error fetching products:', error)
    return (data as Product[]) || []
}

export async function getProductByBarcode(barcode: string) {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      shelves (id, code, capacity)
    `)
        .eq('barcode', barcode)
        .single()

    if (error) return null
    return data as Product
}

export async function updateStock(
    productId: string,
    quantityChange: number,
    type: InventoryLog['transaction_type']
) {
    // 1. Get current product to calculate new quantity
    const { data: product } = await supabase
        .from('products')
        .select('quantity, shelf_id')
        .eq('id', productId)
        .single()

    if (!product) throw new Error('Product not found')

    const newQuantity = Math.max(0, product.quantity + quantityChange)

    // 2. Update product quantity
    const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', productId)

    if (updateError) throw new Error(updateError.message)

    // 3. Log transaction
    const { error: logError } = await supabase
        .from('inventory_logs')
        .insert({
            product_id: productId,
            transaction_type: type,
            quantity_change: quantityChange,
            old_shelf_id: product.shelf_id,
            new_shelf_id: product.shelf_id // No move here
        })

    if (logError) console.error('Error logging transaction:', logError)

    revalidatePath('/inventory')
    revalidatePath('/')
    return { success: true, newQuantity }
}

export async function moveProductToShelf(productId: string, newShelfId: string) {
    // Get current shelf
    const { data: product } = await supabase
        .from('products')
        .select('shelf_id')
        .eq('id', productId)
        .single()

    if (!product) throw new Error('Product not found')

    // Update shelf
    const { error } = await supabase
        .from('products')
        .update({ shelf_id: newShelfId, updated_at: new Date().toISOString() })
        .eq('id', productId)

    if (error) throw new Error(error.message)

    // Log move
    await supabase.from('inventory_logs').insert({
        product_id: productId,
        transaction_type: 'MOVE',
        quantity_change: 0,
        old_shelf_id: product.shelf_id,
        new_shelf_id: newShelfId
    })

    revalidatePath('/inventory')
    return { success: true }
}

export async function createProduct(data: Partial<Product>) {
    const { error } = await supabase
        .from('products')
        .insert([{
            name: data.name,
            barcode: data.barcode,
            description: data.description,
            min_stock: data.min_stock || 5,
            quantity: data.quantity || 0,
            shelf_id: data.shelf_id || null,
        }])

    if (error) throw new Error(error.message)

    revalidatePath('/inventory')
    return { success: true }
}

export async function createShelf(data: Partial<Shelf>) {
    const { error } = await supabase
        .from('shelves')
        .insert([{
            code: data.code,
            capacity: data.capacity || 100,
        }])

    if (error) throw new Error(error.message)

    revalidatePath('/shelves')
    revalidatePath('/audit')
    return { success: true }
}

export async function deleteShelf(shelfId: string) {
    // First, unassign products from this shelf
    await supabase
        .from('products')
        .update({ shelf_id: null })
        .eq('shelf_id', shelfId)

    const { error } = await supabase
        .from('shelves')
        .delete()
        .eq('id', shelfId)

    if (error) throw new Error(error.message)

    revalidatePath('/shelves')
    revalidatePath('/inventory')
    return { success: true }
}

export async function getProductsByShelf(shelfId: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shelf_id', shelfId)
        .order('name')

    if (error) {
        console.error('Error fetching products by shelf:', error)
        return []
    }

    return (data as Product[]) || []
}
