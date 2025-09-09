import { products as seedProducts, Product } from '@/data/products';

const KEYS = {
  products: 'ndx:products',
} as const;

type Id = string;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeed(): void {
  const existing = read<Product[]>(KEYS.products);
  if (!existing || existing.length === 0) {
    write(KEYS.products, seedProducts);
  }
}

export function listProducts(): Product[] {
  ensureSeed();
  return read<Product[]>(KEYS.products) ?? [];
}

export function getProduct(id: Id): Product | undefined {
  return listProducts().find(p => p.id === id);
}

export function createProduct(data: Omit<Product, 'id'>): Product {
  const all = listProducts();
  const id = String(Date.now());
  const next: Product = { id, ...data };
  write(KEYS.products, [next, ...all]);
  return next;
}

export function updateProduct(id: Id, data: Partial<Omit<Product, 'id'>>): Product | undefined {
  const all = listProducts();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  const updated: Product = { ...all[idx], ...data, id };
  all[idx] = updated;
  write(KEYS.products, all);
  return updated;
}

export function deleteProduct(id: Id): boolean {
  const all = listProducts();
  const next = all.filter(p => p.id !== id);
  const removed = next.length !== all.length;
  if (removed) write(KEYS.products, next);
  return removed;
} 