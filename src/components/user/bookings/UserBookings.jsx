import React, {useEffect, useState} from "react";
import {Box, Loader, Pagination} from "@mantine/core";
import {deleteBooking, getFilteredBookings} from "../../../apis/bookingApi.js";
import {useDisclosure, usePagination, useScrollIntoView} from "@mantine/hooks";
import {getReviewById} from "../../../apis/reviewApi.js";
import ReviewModal from "../reviews/ReviewModal.jsx";
import UpdateBookingModal from "../../booking/UpdateBookingModal.jsx";
import styles from "./userBookings.module.scss";
import ConfirmModal from "../../general/confirmModal/ConfirmModal.jsx";
import BookingCard from "../../general/cards/bookingCard/BookingCard.jsx";
import {showErrorNotification, showSuccessNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const UserBookings = ({ user, highlightedBookingId }) => {
    const { t } = useTranslation();
    const [openedConfirm, {open: openConfirm, close: closeConfirm}] = useDisclosure(false);
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [openedBooking, {open: openBooking, close: closeBooking}] = useDisclosure(false);
    const [bookings, setBookings] = useState([]);
    const [reviewInfo, setReviewInfo] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [selectedReviewLoading, setSelectedReviewLoading] = useState(false);
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
            showErrorNotification(error);
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

    const getPageForHighlightedBooking = (bookingId) => {
        const index = bookings.findIndex((booking) => booking.id === bookingId);
        if (index === -1) return null;
        return Math.floor(index / itemsPerPage) + 1;
    }

    const handleDeleteBooking = async (booking) => {
        try {
            await deleteBooking(booking.id);
            await fetchBookings();
            showSuccessNotification("Deleted.");
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        }
    }

    const handleOpenReviewModal = (booking) => {
        setSelectedBooking(booking);
        openReview();
    }

    const handleFetchAndOpenReviewModal = async (booking) => {
        setSelectedReviewLoading(true);
        try {
            const response = await getReviewById(booking.reviewId);
            setReviewInfo(response);
            setSelectedBooking(booking)
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setSelectedReviewLoading(false);
        }
        openReview();
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

    const handleOpenBookingModal = (booking) => {
        setSelectedBooking(booking);
        openBooking();
    }

    const handleOpenConfirm = (booking) => {
        setBookingToDelete(booking);
        openConfirm();
    }

    const handleCloseConfirm = () => {
        closeConfirm();
        setBookingToDelete(null);
    }

    const handleConfirm = async () => {
        await handleDeleteBooking(bookingToDelete);
        handleCloseConfirm();
    }


    if(bookingsLoading || selectedReviewLoading) {
        return <Loader />;
    }

    return (
        <>
            <Box className={styles.box}>
                {currentPageBookings.map((booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        highlightedBookingId={highlightedBookingId}
                        targetRef={targetRef}
                        onUpdateBooking={handleOpenBookingModal}
                        onDeleteBooking={handleOpenConfirm}
                        onUpdateReview={handleFetchAndOpenReviewModal}
                        onCreateReview={handleOpenReviewModal}
                        isUserBooking={true}
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
                    onClose={handleCloseConfirm}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    )
}

export default UserBookings;