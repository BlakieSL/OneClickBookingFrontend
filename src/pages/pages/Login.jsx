import {useNavigate} from "react-router-dom";
import {useForm} from "@mantine/form";
import {validateEmail, validatePassword} from "../../helpers/validation.js";
import {getUserById, login} from "../../apis/userApi.js";
import {jwtDecode} from "jwt-decode";
import {setAccessToken, setRefreshToken, setUser} from "../../helpers/tokenUtils.js";
import {Button, TextInput} from "@mantine/core";

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

            const user = await getUserById(userId);
            setUser(user);

            navigate('/service-points   ')
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
        </form>
    );
}

export default Login;