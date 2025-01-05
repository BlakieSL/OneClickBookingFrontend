import {useParams} from "react-router-dom";
import {useDisclosure, usePagination, useScrollIntoView} from "@mantine/hooks";
import React, {useContext, useEffect, useState} from "react";
import {Box, Button, Container, Loader, Pagination, Stack} from "@mantine/core";
import {deleteBooking, getFilteredBookings} from "../../../../apis/bookingApi.js";
import styles from "../adminItems.module.scss";
import BookingCard from "../../../../components/general/cards/bookingCard/BookingCard.jsx";
import ReviewModal from "../../../../components/user/reviews/ReviewModal.jsx";
import UpdateBookingModal from "../../../../components/booking/UpdateBookingModal.jsx";
import ConfirmModal from "../../../../components/general/confirmModal/ConfirmModal.jsx";
import {getReviewById} from "../../../../apis/reviewApi.js";
import {FiltersContext} from "../../../../context/FilterContext.jsx";
import EmployeeFilter from "../../../../components/general/filter/EmployeeFilter.jsx";
import ServicePointFilter from "../../../../components/general/filter/ServicePointFilter.jsx";
import {DatePickerInput} from "@mantine/dates";
import {showErrorNotification, showSuccessNotification} from "../../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const AdminBookings = () => {
    const { t } = useTranslation();
    const { bookingId } = useParams();
    const highlightedBookingId = bookingId ? parseInt(bookingId) : null;
    const [openedConfirm, {open: openConfirm, close: closeConfirm}] = useDisclosure(false);
    const [openedReview, {open: openReview, close: closeReview}] = useDisclosure(false);
    const [openedBooking, {open: openBooking, close: closeBooking}] = useDisclosure(false);
    const [bookings, setBookings] = useState([]);
    const [reviewInfo, setReviewInfo] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const { filters, resetFilters, updateFilter } = useContext(FiltersContext);
    const [ openedFilter, {open: showFilter, close: hideFilter} ] = useDisclosure(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

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

    useEffect(() => {
        (async () => {
            await fetchBookings();
        })();
    }, [filters]);

    useEffect(() => {
        if (highlightedBookingId && bookings.length > 0) {
            const targetPage = getPageForHighlightedBooking(highlightedBookingId);
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
            showErrorNotification(error);
            console.error(error);
        } finally {
            setBookingsLoading(false);
        }
    }

    const deleteBookingById = async (booking) => {
        try {
            await deleteBooking(booking.id);
            await fetchBookings();
            showSuccessNotification(t('successMessages.bookingDeleted'));
        } catch (error) {
            showErrorNotification(error);
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
            showErrorNotification(error);
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

    const handleDateChange = (date) => {
        setSelectedDate(date);

        if (date) {
            updateFilter("DATE", "selected", date.toLocaleDateString('en-CA'));
        } else {
            updateFilter("DATE", null, null);
        }
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
                    {openedFilter && (
                        <Stack>
                            {renderFilterComponent()}
                        </Stack>
                    )}
                    {!openedFilter && (
                        <Stack>
                            <Button variant="outline" onClick={handleResetFilters}>
                                {t('buttons.reset')}
                            </Button>

                            <Button onClick={() => {
                                setActiveFilter("EMPLOYEE");
                                showFilter();
                            }}>
                                {t('filter.employee')}
                            </Button>

                            <Button onClick={() => {
                                setActiveFilter("SERVICE_POINT")
                                showFilter();
                            }}>
                                {t('filter.servicePoint')}
                            </Button>

                            <DatePickerInput
                                label={t('filter.dateLabel')}
                                placeholder={t('filter.datePlaceholder')}
                                value={selectedDate}
                                onChange={handleDateChange}
                                clearable
                            />
                        </Stack>
                    )}
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