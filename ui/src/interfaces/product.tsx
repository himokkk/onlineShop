interface Product {
    id: number;
    name: string;
    price: number;
    shipping_price: number;
    image_url: string;
    description: string;
    category_name: string;
    owner_name: string;
    post_date: Date;
}

export default Product;
