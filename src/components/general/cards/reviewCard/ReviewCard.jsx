import {Box, Button, Card, Text} from "@mantine/core";
import StarRating from "../../reviews/StarRating.jsx";
import styles from "./reviewCard.module.scss";
import {useTranslation} from "react-i18next";

const ReviewCard = ({
    review,
    onUpdateReview,
    onSeeBooking,
    isUserReview = false
}) => {
    const{ t } = useTranslation();
    return (
        <Card className={styles.card}>
            <Box className={styles.card__header}>
                <Box className={styles.card__rating}>
                    <StarRating rating={review.rating} />
                </Box>
                <Box className={styles.card__header__right}>
                    <Text className={styles.card__user}>
                        {review.user.name}
                    </Text>
                    <Text className={styles.card__date}>
                        {review.date}
                    </Text>
                </Box>
            </Box>
            <Box className={styles.card__section}>
                <Text>
                    <span className={styles.card__label}>{t('general.employee')}</span>{
                    " "}
                    <span className={styles.card__value}>
                        {review.employee ? review.employee.username : t('reviewCard.defaultEmployee')}
                    </span>
                </Text>
            </Box>
            <Text className={styles.card__text}>
                {review.text || t('reviewCard.noText')}
            </Text>
            {isUserReview && (
                <Box className={styles.card__buttons}>
                    <Button className={styles.card__seeReviewButton} onClick={() => onUpdateReview(review)}>
                        {t('buttons.update')}
                    </Button>
                    <Button className={styles.card__seeBookingButton} onClick={() => onSeeBooking(review)}>
                        {t('reviewCard.seeBooking')}
                    </Button>
                </Box>
            )}
        </Card>
    )
}

export default ReviewCard;