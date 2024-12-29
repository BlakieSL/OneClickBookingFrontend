import {Box, Button, Modal, TextInput} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";
import {updateUser} from "../../../apis/userApi.js";

const ChangeModal = ({ user, subject, opened, onClose }) => {
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
            email: (value) => (validateEmail(value) ? null : 'Invalid email'),
            password: (value) => {
                const errors = validatePassword(value);
                return errors ? errors.join('; ') : null;
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
            onClose();
        } catch (error) {
            if(error.response.status === 400) {
                const errors = error.response.data;
                Object.entries(errors).forEach(([field, message]) => {
                    form.setFieldError(field, message);
                });
            }
            console.error(error)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Changing ${subject}`}
            styles={{
                title: {
                    fontSize: '22px',
                    fontWeight: '600'
                }
            }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Old Password"
                    placeholder="Enter your old password"
                    type="password"
                    {...form.getInputProps('oldPassword')}
                    required
                />
                <TextInput
                    label={`New ${subject}`}
                    placeholder={`Enter your new ${subject}`}
                    type={subject === "password" ? "password" : "email"}
                    {...form.getInputProps(subject)}
                    required
                />
                <Button type="submit" disabled={!isDirty}>
                    Confirm
                </Button>
            </form>
        </Modal>
    );
}

export default ChangeModal;