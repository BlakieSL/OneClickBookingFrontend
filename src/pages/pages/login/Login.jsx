import {useNavigate} from "react-router-dom";
import {useForm} from "@mantine/form";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";
import {login} from "../../../apis/userApi.js";
import {jwtDecode} from "jwt-decode";
import {setAccessToken, setRefreshToken, setUser} from "../../../helpers/tokenUtils.js";
import {Anchor, Box, Button, Container, Stack, Text, TextInput} from "@mantine/core";
import styles from "./login.module.scss";
import {showErrorNotification} from "../../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },

        validate: {
            username: (value) => validateEmail(value) ? null : 'Invalid email',
            password: (value) => {
                const errors = validatePassword(value);
                return errors ? errors.join('; ') : null;
            }
        }
    });

    const handleSubmit = async (values) => {
        try {
            const data = await login(values);
            const { accessToken, refreshToken } = data;
            const decodedToken = jwtDecode(accessToken);
            const userId = decodedToken.userId;

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(userId);

            navigate('/service-points')
        } catch(error) {
            showErrorNotification(error);
            console.error(error);
        }
    }

    const handleNavigateRegistration = () => {
        navigate('/registration');
    }

    return (
        <Container className={styles.loginContainer}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box className={styles.loginContainer__textContainer}>
                    <Text className={styles.loginContainer__textContainer__text}>
                        {t('login.login')}
                    </Text>
                </Box>
                <Stack className={styles.loginContainer__innerContainer}>
                    <TextInput
                        label={t('login.labels.email')}
                        placeholder={t('account.email')}
                        {...form.getInputProps('username')}
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
                    <Button type="submit">{t('login.login')}</Button>
                    <Text>
                        {t('login.dontHave')}
                        {" "}
                        <Anchor onClick={handleNavigateRegistration}>
                            {t('login.goTo')}
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Container>
    );
}

export default Login;