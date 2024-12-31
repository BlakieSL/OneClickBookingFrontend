import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../apis/userApi.js";
import {useForm} from "@mantine/form";
import {Box, Button, Container, Stack, TextInput, Text, Anchor} from "@mantine/core";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";
import styles from "./registration.module.scss";

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

    const handleNavigateLogin = () => {
        navigate('/login');
    }

    return (
        <Container className={styles.registrationContainer}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box className={styles.registrationContainer__textContainer}>
                    <Text className={styles.registrationContainer__textContainer__text}>
                        Registration
                    </Text>
                </Box>
                <Stack className={styles.registrationContainer__innerContainer}>
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
                    <Text>
                        Already have an account?{" "}
                        <Anchor onClick={handleNavigateLogin}>
                            Go to Login
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Container>
    );
}

export default Registration;