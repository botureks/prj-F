import { User } from "src/entities/User/model/types/user";

export interface AuthSchema {
    isLoading: boolean;
    isLoggedIn: boolean;
    user: User;
}