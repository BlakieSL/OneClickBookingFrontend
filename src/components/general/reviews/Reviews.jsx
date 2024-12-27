import {Box, Card, Group, Text} from "@mantine/core";
import styles from "./reviews.module.scss"
import StarRating from "./StarRating.jsx";
const Reviews = ({ data }) => {
    const { reviews, averageRating, totalReviews } = data;



    return (
        <Box>
            <Box className={styles.headerBox}>
                <Box>
                    <Text className={styles.headerBox__header}>Reviews</Text>
                </Box>
                <Box className={styles.headerBox__ratingBox}>
                    <StarRating rating={averageRating} />
                    <Text className={styles.headerBox__ratingBox__text}>Based on {totalReviews} reviews</Text>
                </Box>
            </Box>
            <Box className={styles.reviews}>
                {reviews.map((review) => (
                    <Card key={review.id} className={styles.reviews__card}>
                        <Box className={styles.reviews__box}>
                            <Box>
                                <Box className={styles.reviews__rating}>
                                    <StarRating rating={review.rating} />
                                </Box>
                                <Text className={styles.reviews__employee}>
                                    Employee: {review.employee ? review.employee.username : "Default Employee"}
                                </Text>
                            </Box>
                            <Box className={styles.reviews__box__right}>
                                <Text className={styles.reviews__user}>
                                    {review.user.name}
                                </Text>
                                <Text className={styles.reviews__date}>
                                    {review.date}
                                </Text>
                            </Box>
                        </Box>
                        <Text className={styles.reviews__text}>
                            {review.text || "no text"}
                        </Text>
                    </Card>
                ))}
            </Box>
        </Box>

    );
}

export default Reviews;