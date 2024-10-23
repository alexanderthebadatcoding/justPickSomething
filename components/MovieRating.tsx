import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import styles from "./MovieRating.module.css";

interface MovieRatingProps {
  rating: number; // Ensure rating is a number
}

const MovieRating: React.FC<MovieRatingProps> = ({ rating }) => {
  // Function to render stars based on the rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating / 2); // Calculate full stars out of 10 (convert to 5-star system)
    const hasHalfStar = rating / 2 - fullStars >= 0.5; // Determine if half star is needed

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={styles.filledStar} />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key={fullStars} className={styles.filledStar} />
      );
    }

    // Add empty (gray) stars to make a total of 10 stars
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className={styles.emptyStar} />);
    }

    return stars;
  };

  return <div className={styles.ratingContainer}>{renderStars()}</div>;
};

export default MovieRating;
