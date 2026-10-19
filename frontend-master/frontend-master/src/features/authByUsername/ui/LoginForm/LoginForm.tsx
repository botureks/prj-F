import { useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";

import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";

import { Input } from "src/shared/ui/Input";
import { Divider } from "src/shared/ui/Divider/Divider";
import { Button } from "src/shared/ui/Button";
import { Border } from "src/shared/ui/Border";

import { useToast } from "src/shared/lib/hooks/useToast";

import { LoginFormValues } from "src/features/authByUsername/types/LoginFormValues";

import { loginResolver } from "src/features/authByUsername/resolvers/LoginResolver";
import { authActions } from "src/entities/Auth/model/slice/authSlice";

import SIGN_IN from "src/entities/Auth/api/gql/sign-in.model";

import cls from "./LoginForm.module.less";

interface LoginFormProps {
    onChange: () => void;
    onClose: () => void;
}

export const LoginForm = (props: LoginFormProps) => {
    const { onChange, onClose } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({ resolver: loginResolver });

    const [loading, setLoading] = useState(false);
    const [signIn, { loading: mutationLoading }] = useMutation(SIGN_IN);

    const toast = useToast();
    const dispatch = useDispatch();

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);

        try {
            const response = await signIn({
                variables: {
                    username: data.username,
                    password: data.password,
                },
            });

            const payload = response.data?.signIn;
            if (payload) {
                toast.base({ message: payload.message });

                dispatch(authActions.authenticate(payload.user));
                onClose();
            }
        } catch (err) {
            if (err instanceof ApolloError) {
                const errorMessage = err.graphQLErrors[0]?.message;
                toast.error({ message: errorMessage || 'Произошла ошибка' });
            } else {
                toast.error({ message: 'Произошла неизвестная ошибка' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={cls.LoginForm} onSubmit={handleSubmit(onSubmit)}>
            <Input
                placeholder="Никнейм"
                {...register("username", { required: true })}
            />
            {errors.username && (
                <a>{errors.username.message}</a>
            )}

            <Input
                type="password"
                placeholder="Пароль"
                {...register("password", { required: true })}
            />
            {errors.password && (
                <a>{errors.password.message}</a>
            )}

            <Divider />

            <Button type="submit" loading={loading || mutationLoading}>
                Войти
            </Button>

            <Border />

            <span
                className={cls.FormSwitchText}
            >
                Еще нет аккаунта?
                <button onClick={onChange}>Регистрация</button>
            </span>
        </form>
    );
};