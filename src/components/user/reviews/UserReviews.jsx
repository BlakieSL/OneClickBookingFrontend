import {useDisclosure, usePagination} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {deleteReview, getFilteredReviews} from "../../../apis/reviewApi.js";
import {Box, Button, Card, Group, Loader, Pagination, Text} from "@mantine/core";
import StarRating from "../../general/reviews/StarRating.jsx";
import {getBookingById} from "../../../apis/bookingApi.js";
import ReviewModal from "./ReviewModal.jsx";
import styles from "./userReviews.module.scss";
import ConfirmModal from "../../general/scheduleModal/confirmModal/ConfirmModal.jsx";

const UserReviews = ({ user, onSeeBooking }) => {
    const [openedConfirm, {open: openConfirm, close: closeConfirm}] = useDisclosure(false);
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(reviews.length / itemsPerPage);
    const pagination = usePagination(({
        total: totalPages,
        initialPage: 1,
    }))

    const currentPageReviews = reviews.slice(
        (pagination.active -1) * itemsPerPage,
        pagination.active * itemsPerPage,
    )

    const fetchReviews = async () => {
        try {
            const requestBody = {
                filterCriteria:[
                    {
                        filterKey: "USER",
                        value: user.id,
                        operation: "EQUAL",
                    }
                ],
                dataOption: "AND",
            }

            const fetchedReviews = await getFilteredReviews(requestBody);
            setReviews(fetchedReviews.reviews);
        } catch (error) {
            setError("Failed to fetch user reviews");
            console.error(error);
        } finally {
            setReviewsLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchReviews();
        })();
    }, [user]);

    const handleSeeBooking = (review) => {
        onSeeBooking(review.bookingId);
    }

    const handleSeeReview = (review) => {
        setSelectedReview(review);
        openReview();
    }

    const handleSeeReviewCloseWithChanges = async () => {
        handleCloseReview();
        await fetchReviews();
    }
    const handleCloseReview = () => {
        setSelectedReview(null);
        closeReview();
    }
    const handleDeleteReview = async (review) => {
        try {
            await deleteReview(review.id);
            await fetchReviews();
        } catch (error) {
            setError("Failed to delete review")
            console.error(error);
        }
    }

    const handleOpenConfirm = (review) => {
        setReviewToDelete(review);
        openConfirm();
    }

    const handleCloseConfirm = () => {
        closeConfirm();
        setReviewToDelete(null);
    }

    const handleConfirm = async () => {
        await handleDeleteReview(reviewToDelete);
        handleCloseConfirm();
    }

    if(reviewsLoading) {
        return <Loader />;
    }

    return (
        <>
            <Box className={styles.box}>
                {currentPageReviews.map((review) => (
                    <Card key={review.id} className={styles.card}>
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
                            <Button className={styles.card__seeReviewButton} onClick={() => handleSeeReview(review)}>
                                Update Review
                            </Button>
                            <Button className={styles.card__deleteReviewButton} onClick={() => handleOpenConfirm(review)}>
                                Delete Booking
                            </Button>
                            <Button className={styles.card__seeBookingButton} onClick={() => handleSeeBooking(review)}>
                                See Booking
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Box>

            <Pagination
                total={totalPages}
                value={pagination.active}
                onChange={pagination.setPage}
            />
            <ReviewModal
                opened={openedReview}
                close={handleCloseReview}
                onConfirm={handleSeeReviewCloseWithChanges}
                reviewInfo={selectedReview}
            />
            <ConfirmModal
                opened={openedConfirm}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirm}
            />
        </>
    );
};

export default UserReviews;