import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../apis/userApi.js";
import {useForm} from "@mantine/form";
import {Button, TextInput} from "@mantine/core";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";

const Registration = () => {
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
        },

        validate: {
            name: (value) => (value.trim() ? null : 'Name is required'),
            surname: (value) => (value.trim() ? null : 'Surname is required'),
            email: (value) => (validateEmail(value) ? null : 'Invalid email'),
            password: (value) => {
                const errors = validatePassword(value);
                return errors ? errors.join('; ') : null;
            }
        }
    });

    const handleSubmit = async(values) => {
        try {
            await registerUser(values);
            navigate('/login')
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
                {...form.getInputProps('email')}
                type="email"
                required
            />
            <TextInput
                label="Password"
                placeholder="Enter strong password"
                {...form.getInputProps('password')}
                type="password"
                required
            />
            <Button type="submit">Register</Button>
        </form>
    );
}

export default Registration;