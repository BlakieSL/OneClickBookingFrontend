import {Box, Button, Checkbox, Container, Loader, Pagination, Stack, Text} from "@mantine/core";
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
    const { filters, resetFilters, updateFilter } = useContext(FiltersContext);
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
                            <Button variant="outline" onClick={handleResetFilters}>
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

                            <Box>
                                <Checkbox
                                    checked={filters.TEXT.state === "selected"}
                                    color="#718977FF"
                                    onChange={(event) => {
                                        const newState = event.target.checked ? "selected" : null;
                                        updateFilter("TEXT", newState, "NOT_NULL");
                                    }}
                                    label="Only reviews with text"
                                />
                            </Box>
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
