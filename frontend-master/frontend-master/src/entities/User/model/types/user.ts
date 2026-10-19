export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface User {
    id: string;
    username: string;
    picture?: string | null;
    role: UserRole;
    isBlocked: boolean;
}