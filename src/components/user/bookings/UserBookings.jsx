import React, {useEffect, useState} from "react";
import {Box, Button, Card, Group, Loader, Text} from "@mantine/core";
import {getFilteredBookings} from "../../../apis/bookingApi.js";
import {useDisclosure} from "@mantine/hooks";
import {createReview, getReviewById} from "../../../apis/reviewApi.js";
import ReviewModal from "../ReviewModal.jsx";

const UserBookings = ({ user }) => {
    const [opened, {open, close}] = useDisclosure(false);
    const [bookings, setBookings] = useState([]);
    const [reviewInfo, setReviewInfo] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [selectedReviewLoading, setSelectedReviewLoading] = useState(false);
    const [error, setError] = useState(null);

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
        open();
    }
    const handleLeaveReview = (booking) => {
        setSelectedBooking(booking);
        open()
    }

    const handleModalCloseWithChanges = async () => {
        close();
        await fetchBookings();
    };

    if(bookingsLoading || selectedReviewLoading) {
        return <Loader />;
    }

    return (
        <>
            {bookings.map((booking) => (
                <Card key={booking.id}>
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
            <ReviewModal
                opened={opened}
                close={close}
                onConfirm={handleModalCloseWithChanges}
                reviewInfo={reviewInfo}
                booking={selectedBooking}
            />
        </>
    )
}

export default UserBookings;