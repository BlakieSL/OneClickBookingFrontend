import {useNavigate} from "react-router-dom";
import {useForm} from "@mantine/form";
import {validateEmail, validatePassword} from "../../../helpers/validation.js";
import {getUserById, login} from "../../../apis/userApi.js";
import {jwtDecode} from "jwt-decode";
import {getRefreshToken, setAccessToken, setRefreshToken, setUser} from "../../../helpers/tokenUtils.js";
import {Box, Button, Container, Stack, TextInput, Text, Anchor} from "@mantine/core";
import styles from "./login.module.scss";

const Login = () => {
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
                        Login
                    </Text>
                </Box>
                <Stack className={styles.loginContainer__innerContainer}>
                    <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        {...form.getInputProps('username')}
                        type="email"
                        required
                    />
                    <TextInput
                        label="Password"
                        placeholder="Enter your password"
                        {...form.getInputProps('password')}
                        type="password"
                        required
                    />
                    <Button type="submit">Login</Button>
                    <Text>
                        Don't have an account?{" "}
                        <Anchor onClick={handleNavigateRegistration}>
                            Go to Registration
                        </Anchor>
                    </Text>
                </Stack>
            </form>
        </Container>
    );
}

export default Login;