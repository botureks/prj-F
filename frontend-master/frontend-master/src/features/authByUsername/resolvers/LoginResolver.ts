import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Resolver } from "react-hook-form";

import { LoginFormValues } from "src/features/authByUsername/types/LoginFormValues";

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Никнейм не должен быть пустым')
        .matches(/^[a-zA-Z0-9]+$/, 'Никнейм должен содержать только английские символы и цифры')
        .matches(/^[^0-9]/, 'Никнейм не должен начинаться с цифры')
        .min(4, 'Никнейм должен быть длиной от 4 символов')
        .max(16, 'Никнейм должен быть длиной до 16 символов'),
    password: Yup.string()
        .required('Пароль не должен быть пустым')
        .matches(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/, 'Пароль должен содержать только английские символы, цифры')
        .min(8, 'Пароль должен быть длиной от 8 символов')
        .max(32, 'Пароль должен быть длиной до 32 символов'),
});

export const loginResolver: Resolver<LoginFormValues> = yupResolver(validationSchema);