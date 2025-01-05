import i18n from "./i18n_config.js";
import {notifications} from "@mantine/notifications";

export const defaultImage = '/imagenotfound.jpg';

export const showSuccessNotification = (text) => {
    notifications.show({
        title: "Success!",
        message: text,
        position: 'top-right',
        color: 'blue'
    });
}

export const showErrorNotification = (error) => {
    notifications.show({
        title: i18n.t('errorMessages.title'),
        message: getErrorMessage(error),
        position: 'top-right',
        color: 'red'
    });
}

export const getErrorMessage = (error) => {
    const dataMessage = error?.response?.data;

    if (typeof dataMessage === "string") {
        return dataMessage;
    }
    else if (typeof dataMessage === "object") {
        return i18n.t('errorMessages.unexpectedMessage');
    }
}