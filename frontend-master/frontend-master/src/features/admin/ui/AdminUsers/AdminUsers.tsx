import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import GET_USERS from "src/entities/User/api/gql/get-users.model";
import BLOCK_USER from "src/entities/User/api/gql/block-user.model";
import UNBLOCK_USER from "src/entities/User/api/gql/unblock-user.model";
import { User, UserRole } from "src/entities/User/model/types/user";
import { Button } from "src/shared/ui/Button";
import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";
import { useToast } from "src/shared/lib/hooks/useToast";

import cls from "./AdminUsers.module.less";

interface UsersQueryData {
    users: User[];
}

export const AdminUsers = () => {
    const toast = useToast();
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery<UsersQueryData>(GET_USERS);
    const [blockUser, { loading: isBlocking }] = useMutation(BLOCK_USER);
    const [unblockUser, { loading: isUnblocking }] = useMutation(UNBLOCK_USER);

    const changeBlockedState = async (user: User) => {
        try {
            const mutation = user.isBlocked ? unblockUser : blockUser;

            await mutation({ variables: { id: user.id } });
            await refetch();

            toast.success({
                message: user.isBlocked ? "Пользователь разблокирован" : "Пользователь заблокирован"
            });
        } catch {
            toast.error({ message: "Не удалось изменить статус пользователя" });
        }
    };

    if (loading) {
        return <LoaderIcon />;
    }

    if (error) {
        return <div>Не удалось загрузить пользователей</div>;
    }

    return (
        <section className={cls.AdminUsers}>
            <h1>Пользователи</h1>

            <div className={cls.AdminUsersList}>
                {(data?.users ?? []).map((user) => (
                    <div className={cls.AdminUsersRow} key={user.id}>
                        <div
                            className={cls.AdminUsersProfile}
                            onClick={() => router.push(`/profile/${user.id}`)}
                        >
                            <strong>{user.username}</strong>
                            <span>{user.role === UserRole.ADMIN ? "Администратор" : "Пользователь"}</span>
                            {user.isBlocked && <span>Заблокирован</span>}
                        </div>

                        <Button
                            size="sm"
                            variant="bordered"
                            disabled={isBlocking || isUnblocking}
                            onClick={() => changeBlockedState(user)}
                        >
                            {user.isBlocked ? "Разблокировать" : "Заблокировать"}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};