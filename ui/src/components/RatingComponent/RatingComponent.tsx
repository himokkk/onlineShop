import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

interface Props {
    setRating: Function;
}

const RatingComponent = (props: Props) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        props.setRating(rating);
    }, [rating]);

    return (
        <div className="rating">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={starValue}
                            checked={rating === starValue}
                            onChange={() => setRating(starValue)}
                        />
                        <FaStar className="star" color={starValue <= rating ? "#fb923c" : "#e4e5e9"} />
                    </label>
                );
            })}
        </div>
    );
};

export default RatingComponent;
