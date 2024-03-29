import Product from "./product";

interface Order {
    id: number;
    items: Product[];
    status: string;
    owner: number;
    owner_name: string;
    package_numer: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    city: string;
    street: string;
    apartament: string;
    postal_code: string;
    total_products_cost: number;
    total_shipping_cost: number;
}

export default Order;
