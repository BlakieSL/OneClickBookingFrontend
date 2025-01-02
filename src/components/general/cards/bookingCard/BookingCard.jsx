import {Box, Button, Card, Text} from "@mantine/core";
import React from "react";
import styles from "./bookingCard.module.scss";


const BookingCard = ({
    booking,
    highlightedBookingId,
    targetRef,
    onUpdateBooking,
    onDeleteBooking,
    onUpdateReview,
    onCreateReview,
    isUserBooking=false
}) => {
    const isPastBooking = new Date(booking.date) < new Date();

    return (
        <Card
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
                {!isUserBooking && (
                    <Text>
                        <span className={styles.card__label}>User ID:</span>
                        {" "}
                        <span className={styles.card__section}>{booking.userId}</span>
                    </Text>
                )}
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
                <Button colo disabled={isPastBooking}  onClick={() => onUpdateBooking(booking)}>
                    {isPastBooking ? "Completed" : "Update Booking"}
                </Button>
                <Button className={styles.card__deleteButton} onClick={() => onDeleteBooking(booking)}>
                    Delete Booking
                </Button>
                {booking.reviewId ? (
                    <Button className={styles.card__seeReviewButton} onClick={() => onUpdateReview(booking)}>
                        See Review
                    </Button>
                ) : (
                    <Button className={styles.card__leaveReviewButton} onClick={() => onCreateReview(booking)}>
                        Leave a Review
                    </Button>
                )}
            </Box>
        </Card>
    );
}

export default BookingCard;