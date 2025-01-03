import {Button, Modal, TextInput} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";
import {updateUser} from "../../../apis/userApi.js";
import {showErrorNotification, showSuccessNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const ChangeModal = ({ user, subject, opened, onClose, onUpdate }) => {
    const { t } = useTranslation();
    if (!['email', 'password'].includes(subject)) {
        throw new Error(`Invalid subject: ${subject}`);
    }
    const [isDirty, setIsDirty] = useState(false);

    const form = useForm({
        initialValues: {
            oldPassword: '',
            [subject]: '',
        },
        validate: {
            email: (value) => {
                if (subject === 'email') {
                    return validateEmail(value) ? null : 'Invalid email';
                }
                return null;
            },
            password: (value) => {
                if (subject === 'password') {
                    const errors = validatePassword(value);
                    return errors ? errors.join('; ') : null;
                }
                return null;
            },
            oldPassword: (value) => {
                const errors = validatePassword(value);
                return errors ? errors.join('; ') : null;
            }
        }
    });

    useEffect(() => {
        const isFormDirty =
            form.values.oldPassword.trim() !== '' &&
            form.values[subject].trim() !== '';

        setIsDirty(isFormDirty);
    }, [form.values, user]);

    const handleSubmit = async (values) => {
        try {
            await updateUser(user.id, values)
            onUpdate();
            onClose();
            showSuccessNotification("Updated.");
        } catch (error) {
            if(error.response.status === 400) {
                const errors = error.response.data;
                Object.entries(errors).forEach(([field, message]) => {
                    form.setFieldError(field, message);
                });
            }
            console.error(error)
            showErrorNotification(error);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('changeModal.title', { subject })}
            styles={{
                title: {
                    fontSize: '22px',
                    fontWeight: '600'
                }
            }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label={t('changeModal.labels.oldPassword')}
                    placeholder={t('changeModal.placeholders.oldPassword')}
                    type="password"
                    {...form.getInputProps('oldPassword')}
                    required
                />
                <TextInput
                    label={t('changeModal.labels.newSubject', { subject })}
                    placeholder={t('changeModal.placeholders.newSubject', { subject })}
                    type={subject === "password" ? "password" : "email"}
                    {...form.getInputProps(subject)}
                    required
                />
                <Button type="submit" disabled={!isDirty} fullWidth mt="xs">
                    {t('buttons.confirm')}
                </Button>
            </form>
        </Modal>
    );
}

export default ChangeModal;