import {Box, Text} from "@mantine/core";
import styles from "./reviews.module.scss"
import StarRating from "./StarRating.jsx";
import ReviewCard from "../cards/reviewCard/ReviewCard.jsx";
import {useTranslation} from "react-i18next";

const EmployeeReviews = ({ data }) => {
    const { reviews, averageRating, totalReviews } = data;
    const { t } = useTranslation();
    return (
        <Box>
            <Box className={styles.headerBox}>
                <Box>
                    <Text className={styles.headerBox__header}>{t('employeeReviews.reviews')}</Text>
                </Box>
                <Box className={styles.headerBox__ratingBox}>
                    <StarRating rating={averageRating} />
                    <Text className={styles.headerBox__ratingBox__text}>
                        {t('employeeReviews.basedOn', { totalReviews })}
                    </Text>
                </Box>
            </Box>
            <Box className={styles.reviews}>
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review}/>
                ))}
            </Box>
        </Box>
    );
}

export default EmployeeReviews;