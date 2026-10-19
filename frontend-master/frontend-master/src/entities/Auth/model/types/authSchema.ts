import { UserEntity } from "src/shared/api/generated/graphql";

export interface AuthSchema {
    isLoading: boolean;
    isLoggedIn: boolean;
    user: UserEntity
}