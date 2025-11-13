import type { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon;
    permission?: string;
    children?: NavItem[];
    target?: string;
    external?: boolean;
    defaultOpen?: boolean;
    order?: number;
    badge?: {
        label: string;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    };
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface PageAction {
    label: string;
    icon: ReactNode;
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
}

// Ecommerce types
export interface Business {
    id: number;
    name: string;
    slug: string;
    business_type: string;
    created_at: string;
    updated_at: string;
}

export interface ProductCategory {
    id: number;
    business_id: number;
    name: string;
    slug: string;
    description: string;
    parent_id: number | null;
    is_active: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
    parent?: ProductCategory;
    children?: ProductCategory[];
    products_count?: number;
}

export interface MediaAsset {
    id: number;
    url: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
}

export interface Product {
    id: number;
    business_id: number;
    category_id: number | null;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: number;
    sale_price: number | null;
    sku: string;
    stock_quantity: number;
    is_featured: boolean;
    is_active: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
    has_discount: boolean;
    display_price: number;
    category?: ProductCategory;
    media?: MediaAsset[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    business_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    customer_address: string | null;
    order_number: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    subtotal: number;
    tax_amount: number;
    shipping_amount: number;
    discount_amount: number;
    total_amount: number;
    currency: string;
    payment_method: string | null;
    payment_status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    total_items: number;
    items?: OrderItem[];
}