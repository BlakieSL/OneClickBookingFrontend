import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {validateEmail, validatePassword} from "../../helpers/validation.js";
import {updateUser} from "../../apis/userApi.js";
import {Button, TextInput} from "@mantine/core";
import ChangeModal from "./ChangeModal.jsx";
import {useDisclosure} from "@mantine/hooks";

const Account = ({ user }) => {
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

    const handleSubmit = async (values) => {
        try {
            await updateUser(user.id, values)
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

    const handleOpenModal = (modalSubject) => {
        setSubject(modalSubject);
        open();
    };

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Name"
                    placeholder="Enter your name"
                    {...form.getInputProps('name')}
                    required
                />
                <TextInput
                    label="Surname"
                    placeholder="Enter your surname"
                    {...form.getInputProps('surname')}
                    required
                />
                <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    value={form.values.email}
                    onClick={() => handleOpenModal("email")}
                    readOnly
                />
                <TextInput
                    label="Change Password"
                    placeholder="Change Password"
                    value="Change Password"
                    onClick={() => handleOpenModal("password")}
                    readOnly
                />

                <Button type="submit" disabled={!isDirty}>
                    Save
                </Button>
            </form>
            {opened && (
                <ChangeModal
                    user={user}
                    subject={subject}
                    opened={opened}
                    onClose={close}
                />
            )}
        </>
    );
}

export default Account;