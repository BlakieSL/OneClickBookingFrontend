import {Box, Button, Modal} from "@mantine/core";

const ConfirmModal = ({ opened, onClose, onConfirm }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Are you sure?"
            centered
        >
            <Box>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="red" onClick={onConfirm}>
                    Confirm
                </Button>
            </Box>
        </Modal>
    );
};

export default ConfirmModal;