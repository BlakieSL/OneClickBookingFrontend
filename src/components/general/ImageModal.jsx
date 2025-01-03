import {Button, Image, Modal} from "@mantine/core";
import {useTranslation} from "react-i18next";

const ImageModal = ({ opened, onClose, onDelete, selectedImage}) => {
    const { t } = useTranslation();
    return (
        <Modal opened={opened} onClose={onClose} size="lg">
            <Button
                color="red"
                fullWidth
                mb="xs"
                onClick={() => {
                    onDelete(selectedImage);
                    onClose();
                }}
            >
                {t('buttons.delete')}
            </Button>
            <Image
                src={selectedImage.image}
                alt="Full image"
            />
        </Modal>
    )
}
export default ImageModal;