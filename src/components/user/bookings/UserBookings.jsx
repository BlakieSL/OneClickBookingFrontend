import React, {useEffect, useRef, useState} from "react";
import {Box, Button, Card, Group, Loader, Pagination, Text} from "@mantine/core";
import {getFilteredBookings} from "../../../apis/bookingApi.js";
import {useDisclosure, usePagination, useScrollIntoView} from "@mantine/hooks";
import {getReviewById} from "../../../apis/reviewApi.js";
import ReviewModal from "../reviews/ReviewModal.jsx";
import UpdateBookingModal from "../../general/scheduleModal/UpdateBookingModal.jsx";
import styles from "./userBookings.module.scss";
const UserBookings = ({ user, highlightedBookingId }) => {
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [openedBooking, {open: openBooking, close: closeBooking}] = useDisclosure(false);
    const [bookings, setBookings] = useState([]);
    const [reviewInfo, setReviewInfo] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [temporaryHighlight, setTemporaryHighlight] = useState(null);

    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [selectedReviewLoading, setSelectedReviewLoading] = useState(false);
    const [error, setError] = useState(null);

    const { scrollIntoView, targetRef } = useScrollIntoView();

    const itemsPerPage = 5;
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const pagination = usePagination({
        total: totalPages,
        initialPage: 1
    })

    const currentPageBookings = bookings.slice(
        (pagination.active - 1) * itemsPerPage,
        pagination.active * itemsPerPage
    );

    const fetchBookings = async () => {
        try {
            const requestBody = {
                filterCriteria: [
                    {
                        filterKey: "USER",
                        value: user.id,
                        operation: "EQUAL",
                    },
                ],
                dataOption: "AND",
            };

            const fetchedBookings = await getFilteredBookings(requestBody);
            setBookings(fetchedBookings);
        } catch (error) {
            setError("Failed to fetch user bookings");
            console.error(error);
        } finally {
            setBookingsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchBookings();
        })();
    }, [user]);

    useEffect(() => {
        if (highlightedBookingId && bookings.length > 0) {
            const targetPage = getPageForHighlightedBooking(highlightedBookingId);
            if (targetPage && targetPage !== pagination.active) {
                pagination.setPage(targetPage);
                console.log(pagination.active);
            }
        }
    }, [highlightedBookingId, bookings, scrollIntoView]);

    useEffect(() => {
        if (targetRef.current) {
            setTemporaryHighlight(highlightedBookingId);
            scrollIntoView();
            setTimeout(() => setTemporaryHighlight(null), 1000);
        }
    }, [pagination.active]);

    const getPageForHighlightedBooking = (bookingId) => {
        const index = bookings.findIndex((booking) => booking.id === bookingId);
        if (index === -1) return null;
        console.log(index);
        console.log(Math.floor(index / itemsPerPage) + 1)
        return Math.floor(index / itemsPerPage) + 1;
    }

    const handleSeeReview = async (booking) => {
        setSelectedReviewLoading(true);
        try {
            const response = await getReviewById(booking.reviewId);
            setReviewInfo(response);
            setSelectedBooking(booking)
        } catch (error) {
            setError("Failed to fetch a review info");
            console.error(error);
        } finally {
            setSelectedReviewLoading(false);
        }
        openReview();
    }

    const handleLeaveReview = (booking) => {
        setSelectedBooking(booking);
        openReview();
    }

    const handleUpdateBooking = (booking) => {
        setSelectedBooking(booking);
        openBooking();
    }

    const handleModalCloseWithChanges = async () => {
        closeReview();
        closeBooking();
        await fetchBookings();
    };

    if(bookingsLoading || selectedReviewLoading) {
        return <Loader />;
    }

    return (
        <>
            {currentPageBookings.map((booking) => (
                <Card
                    key={booking.id}
                    ref={highlightedBookingId === booking.id ? targetRef : null}
                    className={`${temporaryHighlight === booking.id ? styles.highlightedCard : ""}`}
                >
                    <Group position="apart">
                        <Text>
                            Booking Date: {new Date(booking.date).toLocaleDateString()}{" "}
                            {new Date(booking.date).toLocaleTimeString()}
                        </Text>
                        <Text>ID: {booking.id}</Text>
                    </Group>

                    <Text>
                        Service Point: {booking.servicePoint.name} ({booking.servicePoint.location})
                    </Text>

                    {booking.employee && (
                        <Text>
                            Employee: {booking.employee.username}
                        </Text>
                    )}

                    {booking.treatmentId && (
                        <Text>
                            Treatment ID: {booking.treatmentId}
                        </Text>
                    )}

                    <Button onClick={() => handleUpdateBooking(booking)}>
                        Update Booking
                    </Button>

                    <Box>
                        {booking.reviewId ? (
                            <Button
                                onClick={() => handleSeeReview(booking)}
                            >
                                See Review
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleLeaveReview(booking)}
                            >
                                Leave a Review
                            </Button>
                        )}
                    </Box>
                </Card>
            ))}
            <Pagination
                total={totalPages}
                page={pagination.active}
                onChange={pagination.setPage}
            />

            {openedReview && (
                <ReviewModal
                    opened={openedReview}
                    close={closeReview}
                    onConfirm={handleModalCloseWithChanges}
                    reviewInfo={reviewInfo}
                    booking={selectedBooking}
                />
            )}
            {openedBooking && (
                <UpdateBookingModal
                    opened={openedBooking}
                    onClose={closeBooking}
                    onConfirm={handleModalCloseWithChanges}
                    initialBooking={selectedBooking}
                />
            )}

        </>
    )
}

export default UserBookings;