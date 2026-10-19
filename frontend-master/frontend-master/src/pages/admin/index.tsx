import Head from "next/head";
import { useSelector } from "react-redux";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth";
import { UserRole } from "src/entities/User/model/types/user";
import { AdminUsers } from "src/features/admin/ui/AdminUsers";

const AdminPage = () => {
    const auth = useSelector(getAuth);

    return (
        <>
            <Head>
                <title>Администрирование</title>
            </Head>

            <div className="container">
                {auth.user.role === UserRole.ADMIN ? (
                    <AdminUsers />
                ) : (
                    <div>Недостаточно прав</div>
                )}
            </div>
        </>
    );
};

export default AdminPage;