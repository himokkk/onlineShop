interface Order {
    id: number;
    review_type: string;
    overall_rating: number;
    quality_rating: number;
    delivery_rating: number;
    communication_rating: number;
    description: string;
    owner: number;
    post_date: Date;
}

export default Order;
