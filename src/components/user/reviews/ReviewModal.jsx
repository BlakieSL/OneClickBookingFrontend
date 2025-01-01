import {useForm} from "@mantine/form";
import {useEffect} from "react";
import {createReview, deleteReview, updateReview} from "../../../apis/reviewApi.js";
import {Button, Group, Modal, Rating, Textarea, TextInput} from "@mantine/core";
import ConfirmModal from "../../general/confirmModal/ConfirmModal.jsx";
import {useDisclosure} from "@mantine/hooks";

const ReviewModal = ({opened, close, onConfirm, reviewInfo, booking = null }) => {
    const [openedConfirm, {close: closeConfirm, open: openConfirm}] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            rating: 0,
            text: null,
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
        closeConfirm();
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
        <>
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
                    <Group grow mt="xs">
                        <Button color="red" onClick={openConfirm}>
                            Delete
                        </Button>
                        <Button type="submit">
                            Save
                        </Button>
                    </Group>
                </form>
            </Modal>
            <ConfirmModal
                opened={openedConfirm}
                onClose={closeConfirm}
                onConfirm={handleDelete}
            />
        </>
    )
}

export default ReviewModal;