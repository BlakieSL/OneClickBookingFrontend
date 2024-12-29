import {useForm} from "@mantine/form";
import {useEffect} from "react";
import {createReview, deleteReview, updateReview} from "../../apis/reviewApi.js";
import {Button, Modal, Rating, Textarea, TextInput} from "@mantine/core";

const ReviewModal = ({opened, close, onConfirm, reviewInfo, booking = null }) => {
    const form = useForm({
        initialValues: {
            rating: 0,
            text: '',
            date: new Date().toLocaleDateString(),
        },

        validate: {
            rating: (value) => value > 0 ? null : 'Rating must be greater than 0',
            text: (value) => (!value || value.length <= 255) ? null : 'Text must be less than 255 characters',
        },
    })

    useEffect(() => {
        if (reviewInfo) {
            form.setValues({
                text: reviewInfo.text || "no text",
                rating: reviewInfo.rating,
                date: new Date(reviewInfo.date).toLocaleDateString(),
            });
        }
    }, [reviewInfo]);

    const handleSubmit = async (values) => {
        const requestBody = {
            rating: values.rating,
            text: values.text,
        }

        try {
            if (reviewInfo) {
                await updateReview(reviewInfo.id, requestBody);
            } else {
                requestBody.bookingId = booking.id;
                await createReview(requestBody);
            }
            form.reset();
            onConfirm();
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteReview(reviewInfo.id);
            form.reset();
            onConfirm();
        } catch (error) {
            console.error(error);
        }
    }

    const handleModalClose = () => {
        form.reset();
        close();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            title={reviewInfo ? "Edit Review" : "New Review"}
            styles={{
                title: {
                    fontSize: '22px',
                    fontWeight: '600'
                }
            }}
        >

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Date"
                    value={form.values.date}
                    readOnly
                />
                <Rating
                    {...form.getInputProps('rating')}
                    size = "xl"
                />
                <Textarea
                    label="Your Review"
                    placeholder="Write your review here..."
                    {...form.getInputProps('text')}
                />

                <Button type="submit">
                    Save
                </Button>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </form>
        </Modal>
    )
}

export default ReviewModal;