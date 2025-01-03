import {useNavigate} from "react-router-dom";
import {registerUser} from "../../../apis/userApi.js";
import {useForm} from "@mantine/form";
import {Anchor, Box, Button, Container, Stack, Text, TextInput} from "@mantine/core";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";
import styles from "./registration.module.scss";
import {showErrorNotification, showSuccessNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const Registration = () => {
    const { t } = useTranslation();
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
            showSuccessNotification("Created Account.");
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

    const handleNavigateLogin = () => {
        navigate('/login');
    }

    return (
        <Container className={styles.registrationContainer}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box className={styles.registrationContainer__textContainer}>
                    <Text className={styles.registrationContainer__textContainer__text}>
                        {t('registration.registration')}
                    </Text>
                </Box>
                <Stack className={styles.registrationContainer__innerContainer}>
                    <TextInput
                        label={t('registration.labels.name')}
                        placeholder={t('account.name')}
                        {...form.getInputProps('name')}
                        required
                    />
                    <TextInput
                        label={t('registration.labels.surname')}
                        placeholder={t('account.surname')}
                        {...form.getInputProps('surname')}
                        required
                    />
                    <TextInput
                        label={t('login.labels.email')}
                        placeholder={t('account.email')}
                        {...form.getInputProps('email')}
                        type="email"
                        required
                    />
                    <TextInput
                        label={t('login.labels.password')}
                        placeholder={t('login.password')}
                        {...form.getInputProps('password')}
                        type="password"
                        required
                    />
                    <Button type="submit">{t('registration.registration')}</Button>
                    <Text>
                        {t('registration.haveAccount')}
                        {" "}
                        <Anchor onClick={handleNavigateLogin}>
                            {t('registration.goTo')}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Container>
    );
}

export default Registration;