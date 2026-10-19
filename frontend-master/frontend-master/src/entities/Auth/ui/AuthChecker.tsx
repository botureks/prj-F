import { useDispatch, useSelector } from "react-redux";
import { FC, ReactElement, useEffect } from "react";

import { useLazyQuery } from "@apollo/client";

import { authActions } from "src/entities/Auth/model/slice/authSlice";

import PROFILE from "src/entities/User/api/gql/profile.model";

import { isLoadingValue } from "src/entities/Auth/model/selectors/isLoadingValue";
import { Loader } from "src/widgets/Loader/ui/Loader";

type AuthCheckerProps = {
    children: ReactElement
}

export const AuthChecker: FC<AuthCheckerProps> = (props) => {
    const { children } = props;

    const [profile, { error }] = useLazyQuery(PROFILE,
        {
            fetchPolicy: "no-cache",
            errorPolicy: "all"
        }
    );

    const dispatch = useDispatch();
    const isLoading = useSelector(isLoadingValue);

    useEffect(() => {
        if (isLoading) {
            dispatch(authActions.load());

            profile()
                .then(res => {
                    const { data } = res;
                    if (!data?.profile) {
                        dispatch(authActions.deAuthenticate());
                        return;
                    }

                    dispatch(authActions.authenticate(data.profile));
                })
        }
    }, [isLoading]);

    useEffect(() => {
        if (error) {
            dispatch(authActions.deAuthenticate());
        }
    }, [error]);

    return (
        isLoading ? <Loader/> : children
    )
}