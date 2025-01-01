import {Box, Button, Modal} from "@mantine/core";
import styles from "./confirmModal.module.scss";

const ConfirmModal = ({ opened, onClose, onConfirm }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Are you sure?"
            centered
            closeOnClickOutside={false}
            closeOnEscape={false}
            withCloseButton={false}
            styles={{
                title: {
                    fontSize: '22px',
                    fontWeight: '600',
                }
            }}
        >
            <Box className={styles.box}>
                <Button className={styles.box__element} variant="outline" color="grey" onClick={onClose}>
                    Cancel
                </Button>
                <Button className={styles.box__element} onClick={onConfirm}>
                    Confirm
                </Button>
            </Box>
        </Modal>
    );
};

export default ConfirmModal;