import {Button, Modal, Image} from "@mantine/core";

const ImageModal = ({ opened, onClose, onDelete, selectedImage}) => {
    console.log(selectedImage);
    return (
        <Modal opened={opened} onClose={onClose} size="auto">
            <Button
                color="red"
                fullWidth
                mb="xs"
                onClick={() => {
                    onDelete(selectedImage);
                    onClose();
                }}
            >
                Delete Image
            </Button>
            <Image
                src={selectedImage.image}
                alt="Full image"
            />
        </Modal>
    )
}
export default ImageModal;