import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {getFilteredReviews} from "../../../apis/reviewApi.js";
import {Box, Button, Card, Group, Loader, Text} from "@mantine/core";
import StarRating from "../../general/reviews/StarRating.jsx";
import {getBookingById} from "../../../apis/bookingApi.js";
import ReviewModal from "../ReviewModal.jsx";

const UserReviews = ({ user }) => {
    const [openedBooking, {open: openBooking, close: closeBooking}] = useDisclosure(false);
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [reviews, setReviews] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);

    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [selectedBookingLoading, setSelectedBookingLoading] = useState(false);
    const [selectedReviewLoading, setSelectedReviewLoading] = useState(false);

    const [error, setError] = useState(null);

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
            setReviews(fetchedReviews);
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

    const handleSeeBooking = async (review) => {
        setSelectedBookingLoading(true);
        try {
            const response = await getBookingById(review.bookingId);
            setSelectedBooking(response);
        } catch (error) {
            setError("Failed to fetch a bookings info");
            console.error(error);
        } finally {
            setSelectedReviewLoading(false);
        }
        openBooking();
    }

    const handleSeeReview = (review) => {
        setSelectedReview(review);
        openReview();
    }

    const handleSeeReviewCloseWithChanges = async () => {
        closeReview();
        await fetchReviews();
    }

    if(reviewsLoading || selectedBookingLoading || selectedReviewLoading) {
        return <Loader />;
    }

    return (
        <>
            {reviews.reviews.map((review) => (
                <Card key={review.id} shadow="sm" padding="md" margin="sm">
                    <Box>
                        <StarRating rating={review.rating} />
                    </Box>
                    <Box>
                        <Text>{review.date}</Text>
                        <Text>
                            Employee: {review.employee ? review.employee.username : "Default Employee"}
                        </Text>
                    </Box>
                    <Text>
                        {review.text || "No text provided"}
                    </Text>
                    <Button onClick={() => handleSeeBooking(review)}>
                        See Booking
                    </Button>
                    <Button onClick={() => handleSeeReview(review)}>
                        See Review
                    </Button>
                </Card>
            ))}
            <ReviewModal
                opened={openedReview}
                close={closeReview}
                onConfirm={handleSeeReviewCloseWithChanges}
                reviewInfo={selectedReview}
            />
        </>
    )

}

export default UserReviews;