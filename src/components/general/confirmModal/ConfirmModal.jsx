import {Box, Button, Modal} from "@mantine/core";
import styles from "./confirmModal.module.scss";
import {useTranslation} from "react-i18next";

const ConfirmModal = ({ opened, onClose, onConfirm }) => {
    const { t } = useTranslation();
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('confirmModal.title')}
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
                    {t('buttons.cancel')}
                </Button>
                <Button className={styles.box__element} onClick={onConfirm}>
                    {t('buttons.confirm')}
                </Button>
            </Box>
        </Modal>
    );
};

export default ConfirmModal;