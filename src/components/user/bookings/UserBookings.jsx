import React, {useEffect, useRef, useState} from "react";
import {Box, Button, Card, Group, Loader, Pagination, Text} from "@mantine/core";
import {deleteBooking, getFilteredBookings} from "../../../apis/bookingApi.js";
import {useDisclosure, usePagination, useScrollIntoView} from "@mantine/hooks";
import {getReviewById} from "../../../apis/reviewApi.js";
import ReviewModal from "../reviews/ReviewModal.jsx";
import UpdateBookingModal from "../../general/scheduleModal/UpdateBookingModal.jsx";
import styles from "./userBookings.module.scss";
import ReactPaginate from 'react-paginate';

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
            }
        }
    }, [highlightedBookingId, bookings]);

    useEffect(() => {
        if (targetRef.current) {
            setTemporaryHighlight(highlightedBookingId);
            setTimeout(() => setTemporaryHighlight(null), 1000);
        }
    }, [pagination.active]);

    const getPageForHighlightedBooking = (bookingId) => {
        const index = bookings.findIndex((booking) => booking.id === bookingId);
        if (index === -1) return null;
        return Math.floor(index / itemsPerPage) + 1;
    }

    const handleSeeReview = async (booking) => {
        setSelectedReviewLoading(true);
        try {
            const response = await getReviewById(booking.reviewId);
            console.log(response);

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

    const handleDeleteBooking = async (booking) => {
        try {
            await deleteBooking(booking.id);
            await fetchBookings();
        } catch (error) {
            setError("Failed to delete booking");
            console.error(error);
        }
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
        handleCloseReview();
        closeBooking();
        await fetchBookings();
    };

    const handleCloseReview = () => {
        closeReview();
        setReviewInfo(null);
    }

    if(bookingsLoading || selectedReviewLoading) {
        return <Loader />;
    }

    return (
        <Box className={styles.box}>
            {currentPageBookings.map((booking) => (
                <Card
                    key={booking.id}
                    ref={highlightedBookingId === booking.id ? targetRef : null}
                    className={`${styles.card} ${highlightedBookingId === booking.id ? styles.highlightedCard : ""}`}
                >
                    <Box className={styles.card__header}>
                        <Text className={styles.card__dateAndId}>
                            {new Date(booking.date).toLocaleDateString()}
                            {" "}
                            {new Date(booking.date).toLocaleTimeString()}
                        </Text>
                        <Text className={styles.card__dateAndId}>ID: {booking.id}</Text>
                    </Box>

                    <Box className={styles.card__section}>
                        <Text>
                            <span className={styles.card__label}>Service Point:</span>
                            {" "}
                            <span className={styles.card__value}>{booking.servicePoint.name} ({booking.servicePoint.location})</span>
                        </Text>
                        {booking.employee && (
                            <Text>
                                <span className={styles.card__label}>Employee:</span>
                                {" "}
                                <span className={styles.card__value}>{booking.employee.username}</span>
                            </Text>
                        )}
                        {booking.treatmentId && (
                            <Text>
                                <span className={styles.card__label}>Treatment ID:</span>
                                {" "}
                                <span className={styles.card__value}>{booking.treatmentId}</span>
                            </Text>
                        )}
                    </Box>

                    <Box className={styles.card__buttons}>
                        <Button className={styles.card__updateButton} onClick={() => handleUpdateBooking(booking)}>
                            Update Booking
                        </Button>
                        <Button className={styles.card__deleteButton} onClick={() => handleDeleteBooking(booking)}>
                            Delete Booking
                        </Button>
                        {booking.reviewId ? (
                            <Button className={styles.card__seeReviewButton} onClick={() => handleSeeReview(booking)}>
                                See Review
                            </Button>
                        ) : (
                            <Button className={styles.card__leaveReviewButton} onClick={() => handleLeaveReview(booking)}>
                                Leave a Review
                            </Button>
                        )}
                    </Box>
                </Card>
            ))}
            <Pagination
                total={totalPages}
                value={pagination.active}
                onChange={pagination.setPage}
            />

            {openedReview && (
                <ReviewModal
                    opened={openedReview}
                    close={handleCloseReview}
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

        </Box>
    )
}

export default UserBookings;