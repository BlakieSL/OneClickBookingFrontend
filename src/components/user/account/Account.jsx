import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {updateUser} from "../../../apis/userApi.js";
import {Button, Stack, TextInput} from "@mantine/core";
import ChangeModal from "./ChangeModal.jsx";
import {useDisclosure} from "@mantine/hooks";
import styles from "./account.module.scss";
import {showErrorNotification} from "../../../helpers/constants.js";

const Account = ({ user, onUserUpdate }) => {
    const [isDirty, setIsDirty] = useState(false);
    const [opened, {open, close}] = useDisclosure(false);
    const [subject, setSubject] = useState(null);

    const form = useForm(({
        initialValues: {
            name: user.name,
            surname: user.surname,
            email: user.email,
        },
        validate: {
            name: (value) => (value.trim() ? null : 'Name is required'),
            surname: (value) => (value.trim() ? null : 'Surname is required'),
        },
    }));

    useEffect(() => {
        const isFormDirty =
            form.values.name !== user.name ||
            form.values.surname !== user.surname;

        setIsDirty(isFormDirty);
    }, [form.values, user]);

    useEffect(() => {
        form.setValues({
            name: user.name,
            surname: user.surname,
            email: user.email,
        });
    }, [user]);

    const handleSubmit = async () => {
        const updatedFields = {};
        for (const key in form.values) {
            if (form.values[key] !== user[key]) {
                updatedFields[key] = form.values[key];
            }
        }

        try {
            await updateUser(user.id, updatedFields)
            setIsDirty(false);
            onUserUpdate();
        } catch (error) {
            if(error.response.status === 400) {
                const errors = error.response.data;
                Object.entries(errors).forEach(([field, message]) => {
                    form.setFieldError(field, message);
                });
            }
            showErrorNotification(error);
            console.error(error)
        }
    }

    const handleOpenModal = (modalSubject) => {
        setSubject(modalSubject);
        open();
    };

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack className={styles.box}>
                    <TextInput
                        placeholder="Enter your name"
                        {...form.getInputProps("name")}
                        required
                    />
                    <TextInput
                        placeholder="Enter your surname"
                        {...form.getInputProps("surname")}
                        required
                    />
                    <TextInput
                        placeholder="Enter your email"
                        value={form.values.email}
                        onClick={() => handleOpenModal("email")}
                        readOnly
                        classNames={{
                            input: styles.readonlyInput
                        }}
                    />
                    <TextInput
                        placeholder="Change Password"
                        value="Change Password"
                        onClick={() => handleOpenModal("password")}
                        readOnly
                        classNames={{
                            input: styles.readonlyInput
                        }}
                    />
                    <Button type="submit" disabled={!isDirty} className={styles.button}>
                        Save
                    </Button>
                </Stack>
            </form>
            {opened && (
                <ChangeModal
                    user={user}
                    subject={subject}
                    opened={opened}
                    onClose={close}
                    onUpdate={onUserUpdate}
                />
            )}
        </>
    );
};

export default Account;