import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";
import {createReview, deleteReview, updateReview} from "../../../apis/reviewApi.js";
import {Button, FileInput, Group, Image, Loader, Modal, Rating, Textarea, TextInput} from "@mantine/core";
import ConfirmModal from "../../general/confirmModal/ConfirmModal.jsx";
import {useDisclosure} from "@mantine/hooks";
import {createImage, deleteImage, getAllImagesForParent} from "../../../apis/imageApi.js";
import {Carousel} from "@mantine/carousel";
import ImageModal from "../../general/ImageModal.jsx";
import {showErrorNotification, showSuccessNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const ReviewModal = ({opened, close, onConfirm, reviewInfo, booking = null }) => {
    const { t } = useTranslation();
    const [prefetchedImages, setPrefetchedImages] = useState([]);
    const [openedConfirm, {close: closeConfirm, open: openConfirm}] = useDisclosure(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [createImageLoading, setCreateImageLoading] = useState(false);
    const [deleteImageLoading, setDeleteImageLoading] = useState(false);
    const [imagesLoading, setImagesLoading] = useState(false);
    const [openedImage, {open: openImage, close: closeImage}] = useDisclosure(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const form = useForm({
        initialValues: {
            rating: 0,
            text: null,
            date: new Date().toLocaleDateString(),
            images: [],
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
            (async () => {
                await fetchAllImages();
            })();
        }
    }, [reviewInfo]);

    const fetchAllImages = async () => {
        setImagesLoading(true);
        try {
            const response = await getAllImagesForParent("REVIEW", reviewInfo.id);
            const transformedImages = response.map((image) => ({
                id: image.id,
                image: `data:image/png;base64,${image.image}`,
            }));
            setPrefetchedImages(transformedImages);
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setImagesLoading(false);
        }
    }
    const handleSubmit = async (values) => {
        const requestBody = {
            rating: values.rating,
            text: values.text,
        }

        setCreateLoading(true);

        try {
            if (reviewInfo) {
                await updateReview(reviewInfo.id, requestBody);
                showSuccessNotification(t('successMessages.reviewUpdated'));
            } else {
                requestBody.bookingId = booking.id;
                await createReview(requestBody);
                showSuccessNotification(t('successMessages.reviewCreated'));
            }

            for (const image of values.images) {
                await handleImageUpload(image);
            }

            form.reset();
            onConfirm();
        } catch (error) {
            showErrorNotification(error);
            console.error(error)
        } finally {
            setCreateLoading(false);
        }
    }

    const handleDelete = async () => {
        closeConfirm();
        setDeleteLoading(true);
        try {
            await deleteReview(reviewInfo.id);
            form.reset();
            onConfirm();
            showSuccessNotification(t('successMessages.reviewDeleted'));
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleImageUpload = async (image) => {
        setCreateImageLoading(true);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("parentType", "REVIEW");
        formData.append("parentId", reviewInfo.id);

        try {
            await createImage(formData);
            showSuccessNotification(t("successMessages.imageCreated"));
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setCreateImageLoading(false);
        }
    }

    const handleImageDelete = async (image) => {
        setDeleteImageLoading(true);
        setPrefetchedImages((prev) => prev.filter((img) => img.id !== image.id));
        try {
            await deleteImage(image.id);
            showSuccessNotification(t('successMessages.imageDeleted'));
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setDeleteImageLoading(false);
        }
    }

    const handleModalClose = () => {
        form.reset();
        close();
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        openImage();
    }

    if (createLoading || deleteLoading || createImageLoading || imagesLoading || deleteImageLoading) {
        return <Loader />;
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={handleModalClose}
                title={reviewInfo ? t('reviewModal.titleEdit') : t('reviewModal.titleNew')}
                styles={{
                    title: {
                        fontSize: '22px',
                        fontWeight: '600'
                    }
                }}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label={t('reviewModal.date')}
                        value={form.values.date}
                        readOnly
                    />
                    <Rating
                        {...form.getInputProps('rating')}
                        size = "xl"
                    />
                    <Textarea
                        label={t('reviewModal.labels.text')}
                        placeholder={t('reviewModal.placeholders.text')}
                        {...form.getInputProps('text')}
                    />
                    <FileInput
                        label={t('reviewModal.labels.image')}
                        placeholder={t('reviewModal.placeholders.image')}
                        accept="image/*"
                        multiple
                        clearable
                        {...form.getInputProps("images")}
                    />
                    {prefetchedImages.length > 0 && (
                        <Carousel
                            dragFree
                            slideGap="sm"
                            align="start"
                            slideSize="10%"
                            height={150}
                            styles={{
                                container: {
                                    userSelect: 'none'
                                },
                                control: {
                                    opacity: '50%',
                                    width: '32px',
                                    height: '32px',
                                },
                                viewport: {
                                    padding: '20px',
                                },
                            }}
                        >
                            {prefetchedImages.map((image) => (
                                <Carousel.Slide
                                    key={image.id}
                                    onClick={() => handleImageClick(image)}
                                >
                                    <Image
                                        src={image.image}
                                        alt="Review image"
                                        w={100}
                                        h={130}
                                        fit="contain"
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    )}
                    <Group grow mt="md">
                        <Button color="red" onClick={openConfirm}>
                            {t('buttons.delete')}
                        </Button>
                        <Button type="submit">
                            {t('buttons.save')}
                        </Button>
                    </Group>
                </form>
            </Modal>
            <ConfirmModal
                opened={openedConfirm}
                onClose={closeConfirm}
                onConfirm={handleDelete}
            />
            {openedImage && (
                <ImageModal
                    opened={openedImage}
                    onClose={closeImage}
                    onDelete={handleImageDelete}
                    selectedImage={selectedImage}
                />
            )}
        </>
    )
}

export default ReviewModal;