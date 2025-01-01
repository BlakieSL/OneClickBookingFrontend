import {Box, Button, Card, Text} from "@mantine/core";
import StarRating from "../../reviews/StarRating.jsx";
import styles from "./reviewCard.module.scss";

const ReviewCard = ({
    review,
    onUpdateReview,
    onSeeBooking,
}) => {
    return (
        <Card className={styles.card}>
            <Box className={styles.card__header}>
                <Box className={styles.card__rating}>
                    <StarRating rating={review.rating} />
                </Box>
                <Text className={styles.card__date}>
                    {new Date(review.date).toLocaleDateString()}
                </Text>
            </Box>
            <Box className={styles.card__section}>
                <Text>
                    <span className={styles.card__label}>Employee:</span>{
                    " "}
                    <span className={styles.card__value}>{review.employee ? review.employee.username : "Default Employee"}</span>
                </Text>
            </Box>
            <Text className={styles.card__section}>
                {review.text || "No text provided"}
            </Text>
            <Box className={styles.card__buttons}>
                <Button className={styles.card__seeReviewButton} onClick={() => onUpdateReview(review)}>
                    Update Review
                </Button>
                <Button className={styles.card__seeBookingButton} onClick={() => onSeeBooking(review)}>
                    See Booking
                </Button>
            </Box>
        </Card>
    )
}

export default ReviewCard;