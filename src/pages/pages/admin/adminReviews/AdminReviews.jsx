import {Box, Button, Container, Loader, Pagination, Stack} from "@mantine/core";
import styles from "../adminItems.module.scss";
import {useDisclosure, usePagination} from "@mantine/hooks";
import {useContext, useEffect, useState} from "react";
import {getFilteredReviews} from "../../../../apis/reviewApi.js";
import ReviewCard from "../../../../components/general/cards/reviewCard/ReviewCard.jsx";
import ReviewModal from "../../../../components/user/reviews/ReviewModal.jsx";
import {useNavigate} from "react-router-dom";
import EmployeeFilter from "../../../../components/general/filter/EmployeeFilter.jsx";
import {FiltersContext} from "../../../../context/FilterContext.jsx";
import ServicePointFilter from "../../../../components/general/filter/ServicePointFilter.jsx";


const AdminReviews = () => {
    const navigate = useNavigate();
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [totalReviews, setTotalReviews] = useState(null);
    const { filters, resetFilters } = useContext(FiltersContext);
    const [selectedReview, setSelectedReview] = useState(null);
    const [ openedFilter, {open: showFilter, close: hideFilter} ] = useDisclosure(false);
    const [activeFilter, setActiveFilter] = useState(null);

    const [reviewsLoading, setReviewsLoading] = useState(true);
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
            console.log(fetchedReviews);
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
                    filterKey: key,
                    value: value,
                    operation: "EQUAL"
                })
            } else if (state === "deselected") {
                filterCriteria.push({
                    filterKey: key,
                    value: value,
                    operation: "NOT_EQUAL"
                })
            }
        })

        if(filters.TEXT.state === "selected") {
            filterCriteria.push({
                filterKey: "TEXT",
                value: "NOT_NULL",
                operation: "EQUAL"
            });
        }

        return {filterCriteria, dataOption: "AND"}
    }

    const handleSeeBooking = (review) => {
        navigate(`/admin-bookings/${review.bookingId}`);
        setTimeout(() => navigate(`/admin-bookings`), 1300);
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

    const handleCloseFilter = () => {
        setActiveFilter(null);
        hideFilter();
    }

    const handleResetFilters = () => {
        resetFilters();
    }

    const renderFilterComponent = () => {
        switch (activeFilter) {
            case "EMPLOYEE":
                return <EmployeeFilter onClose={handleCloseFilter}/>;

            case "SERVICE_POINT":
                return <ServicePointFilter onClose={handleCloseFilter} />;

            default:
                return null;
        }
    };



    if(reviewsLoading) {
        return <Loader />;
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
                    {openedFilter && (
                        <Stack>
                            {renderFilterComponent()}
                        </Stack>
                    )}
                    {!openedFilter && (
                        <Stack>
                            <Button onClick={handleResetFilters}>
                                Reset
                            </Button>

                            <Button onClick={() => {
                                setActiveFilter("EMPLOYEE");
                                showFilter();
                            }}>
                                Select Employee
                            </Button>

                            <Button onClick={() => {
                                setActiveFilter("SERVICE_POINT")
                                showFilter();
                            }}>
                                Select Service Point
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Container>

            {openedReview && (
                <ReviewModal
                    opened={openedReview}
                    close={handleCloseReviewModal}
                    onConfirm={handleCloseReviewModalWithChanges}
                    reviewInfo={selectedReview}
                />
            )}
        </>
    );
}

export default AdminReviews;
