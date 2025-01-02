import {useDisclosure, usePagination} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {getFilteredReviews} from "../../../apis/reviewApi.js";
import {Box, Loader, Pagination} from "@mantine/core";
import ReviewModal from "./ReviewModal.jsx";
import styles from "./userReviews.module.scss";
import ReviewCard from "../../general/cards/reviewCard/ReviewCard.jsx";
import {showErrorNotification} from "../../../helpers/constants.js";

const UserReviews = ({ user, onSeeBooking }) => {
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);

    const [reviewsLoading, setReviewsLoading] = useState(true);
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
            showErrorNotification(error);
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

    const handleOpenReviewToUpdate = (review) => {
        setSelectedReview(review);
        openReview();
    }

    const handleCloseReviewWithChanges = async () => {
        handleCloseReview();
        await fetchReviews();
    }
    const handleCloseReview = () => {
        setSelectedReview(null);
        closeReview();
    }

    if(reviewsLoading) {
        return <Loader />;
    }

    return (
        <>
            <Box className={styles.box}>
                {currentPageReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onUpdateReview={handleOpenReviewToUpdate}
                        onSeeBooking={handleSeeBooking}
                        isUserReview={true}
                    />
                ))}
                <Pagination
                    total={totalPages}
                    value={pagination.active}
                    onChange={pagination.setPage}
                />
            </Box>

            {openedReview && (
                <ReviewModal
                    opened={openedReview}
                    close={handleCloseReview}
                    onConfirm={handleCloseReviewWithChanges}
                    reviewInfo={selectedReview}
                />
            )}
        </>
    );
};

export default UserReviews;