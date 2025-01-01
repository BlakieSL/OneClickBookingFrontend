import {useParams} from "react-router-dom";
import {useDisclosure, usePagination, useScrollIntoView} from "@mantine/hooks";
import React, {useEffect, useState} from "react";
import {Box, Container, Loader, Pagination} from "@mantine/core";
import {deleteBooking, getFilteredBookings} from "../../../../apis/bookingApi.js";
import styles from "../adminItems.module.scss";
import BookingCard from "../../../../components/general/cards/bookingCard/BookingCard.jsx";
import ReviewModal from "../../../../components/user/reviews/ReviewModal.jsx";
import UpdateBookingModal from "../../../../components/booking/UpdateBookingModal.jsx";
import ConfirmModal from "../../../../components/general/confirmModal/ConfirmModal.jsx";
import {getReviewById} from "../../../../apis/reviewApi.js";

const AdminBookings = () => {
    const { bookingId } = useParams();
    const highlightedBookingId = bookingId ? parseInt(bookingId) : null;
    const [openedConfirm, {open: openConfirm, close: closeConfirm}] = useDisclosure(false);
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [openedBooking, {open: openBooking, close: closeBooking}] = useDisclosure(false);
    const [bookings, setBookings] = useState([]);
    const [reviewInfo, setReviewInfo] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [filters, setFilters] = useState({
        EMPLOYEE: {
            state: null,
            value: null
        },
        SERVICE_POINT: {
            state: null,
            value: null
        },
        DATE: {
            state: null,
            value: null
        },
        USER: {
            state: null,
            value: null,
        }
    })

    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [selectedReviewLoading, setSelectedReviewLoading] = useState(false);
    const [error, setError] = useState(null);

    const { targetRef } = useScrollIntoView();
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

    useEffect(() => {
        (async () => {
            await fetchBookings();
        })();
    }, [filters]);

    useEffect(() => {
        if (highlightedBookingId && bookings.length > 0) {
            const targetPage = getPageForHighlightedBooking(highlightedBookingId);
            console.log(targetPage);
            if (targetPage && targetPage !== pagination.active) {
                pagination.setPage(targetPage);
            }
        }
    }, [highlightedBookingId, bookings]);

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const requestBody = setRequestBody();
            console.log(requestBody);

            const fetchedBookings = await getFilteredBookings(requestBody);
            setBookings(fetchedBookings);
        } catch (error) {
            setError("Failed to fetch bookings");
            console.error(error);
        } finally {
            setBookingsLoading(false);
        }
    }

    const deleteBookingById = async (booking) => {
        try {
            await deleteBooking(booking.id);
            await fetchBookings();
        } catch (error) {
            setError("Failed to delete booking");
            console.error(error);
        }
    }

    const getPageForHighlightedBooking = (bookingId) => {
        const index = bookings.findIndex((booking) => booking.id === bookingId);
        if (index === -1) return null;
        return Math.floor(index / itemsPerPage) + 1;
    }

    const setRequestBody = () => {
        const filterCriteria = [];

        Object.keys(filters).map((key) => {
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

        return {filterCriteria, dataOption: "AND"};
    }

    const updateFilter = (key, newState, newValue = null) => {
        const updatedFilters = {...filters};
        updatedFilters[key] = { state: newState, value: newValue };
        setFilters(updatedFilters);
    }

    const handleOpenBookingModal = (booking) => {
        setSelectedBooking(booking);
        openBooking();
    }

    const handleOpenDeleteConfirm = (booking) => {
        setBookingToDelete(booking);
        openConfirm();
    }

    const handleFetchAndOpenReviewModal = async (booking) => {
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

    const handleOpenReviewModal = (booking) => {
        setSelectedBooking(booking);
        openReview();
    }

    const handleCloseDeleteConfirm = () => {
        closeConfirm();
        setBookingToDelete(null);
    }

    const handleConfirmDelete = async () => {
        await deleteBookingById(bookingToDelete);
        handleCloseDeleteConfirm();
    }

    const handleCloseReview = () => {
        setReviewInfo(null);
        closeReview();
    }

    const handleModalCloseWithChanges = async () => {
        handleCloseReview();
        closeBooking();
        await fetchBookings();
    };

    if (bookingsLoading || selectedReviewLoading) {
        return <Loader />;
    }

    return (
        <>
            <Container className={styles.outerContainer}>
                <Box className={styles.mainBox}>
                    {currentPageBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            highlightedBookingId={highlightedBookingId}
                            targetRef={targetRef}
                            onUpdateBooking={handleOpenBookingModal}
                            onDeleteBooking={handleOpenDeleteConfirm}
                            onUpdateReview={handleFetchAndOpenReviewModal}
                            onCreateReview={handleOpenReviewModal}
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
            {openedConfirm && (
                <ConfirmModal
                    opened={openedConfirm}
                    onClose={handleCloseDeleteConfirm}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}

export default AdminBookings;