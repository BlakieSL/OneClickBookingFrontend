import {Box, Container, Pagination} from "@mantine/core";
import styles from "./adminReviews.module.scss";
import {useDisclosure, usePagination} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {deleteReview, getFilteredReviews} from "../../../apis/reviewApi.js";
import ReviewCard from "../../../components/general/cards/reviewCard/ReviewCard.jsx";
import ReviewModal from "../../../components/user/reviews/ReviewModal.jsx";
import ConfirmModal from "../../../components/general/confirmModal/ConfirmModal.jsx";


const AdminReviews = () => {
    const [openedConfirm, {open: openConfirm, close: closeConfirm}] = useDisclosure(false);
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [totalReviews, setTotalReviews] = useState(null);
    const [filters, setFilters] = useState({
       EMPLOYEE: {
           state: null,
           value: null
       },
       SERVICE_POINT: {
           state: null,
           value: null
       },
       TEXT: {
           state: null,
           value: null
       },
       USER: {
           state: null,
       },
    });
    const [selectedReview, setSelectedReview] = useState(null);

    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);
    const [updateReviewLoading, setUpdateReviewLoading] = useState(false);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(reviews.length / itemsPerPage);
    const pagination = usePagination({
        total: totalPages,
        initialPage: 1,
    })

    const currentPageReviews = reviews.slice(
        (pagination.active -1) * itemsPerPage,
        pagination.active * itemsPerPage,
    )

    useEffect(() => {
        (async () => {
            await fetchReviews();
        })();
    }, [filters]);

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const requestBody = setRequestBody();
            console.log(requestBody);

            const fetchedReviews = await getFilteredReviews(requestBody);
            setReviews(fetchedReviews.reviews);
            setAverageRating(fetchedReviews.averageRating);
            setTotalReviews(fetchedReviews.totalReviews);

        } catch (error) {
            setError("Failed to fetch reviews");
            console.error(error);
        } finally {
            setReviewsLoading(false);
        }
    }

    const setRequestBody = () => {
        const filterCriteria = [];

        Object.keys(filters).forEach((key) => {
            const { state, value } = filters[key];

            if (state === "selected") {
                filterCriteria.push({
                    field: key,
                    value: value,
                    operation: "EQUAL"
                })
            } else if (state === "deselected") {
                filterCriteria.push({
                    field: key,
                    value: value,
                    operation: "NOT_EQUAL"
                })
            }
        })

        if(filters.TEXT.state === "selected") {
            filterCriteria.push({
                field: "TEXT",
                value: "NOT_NULL",
                operation: "EQUAL"
            });
        }

        return {filterCriteria, dataOption: "AND"}
    }

    const updateFilter = (key, newState, newValue = null) => {
        const updatedFilters = {...filters};
        updatedFilters[key] = { state: newState, value: newValue };
        setFilters(updatedFilters);
    }

    const handleSeeBooking = (review) => {

    }

    const handleOpenReviewModal = (review) => {
        setSelectedReview(review);
        openReview();
    }

    const handleCloseReviewModal = () => {
        setSelectedReview(null);
        closeReview();
    }

    const handleCloseReviewModalWithChanges = async () => {
        handleCloseReviewModal();
        await fetchReviews();
    }

    return (
        <>
            <Container className={styles.outerContainer}>
                <Box className={styles.mainBox}>
                    {currentPageReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onUpdateReview={handleOpenReviewModal}
                            onSeeBooking={handleSeeBooking}
                        />
                    ))}
                    <Pagination
                        total={totalPages}
                        value={pagination.active}
                        onChange={pagination.setPage}
                    />
                </Box>

                <Box className={styles.filterBox}>

                </Box>
            </Container>

            <ReviewModal
                opened={openedReview}
                close={handleCloseReviewModal}
                onConfirm={handleCloseReviewModalWithChanges}
                reviewInfo={selectedReview}
            />
        </>
    );
}

export default AdminReviews;
