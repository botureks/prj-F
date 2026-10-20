import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";

import GET_USER_PROFILE from "src/entities/User/api/gql/get-user-profile.model";
import UPDATE_MY_DESCRIPTION from "src/entities/User/api/gql/update-my-description.model";
import { getAuth } from "src/entities/Auth/model/selectors/getAuth";
import { PostModel } from "src/entities/Post/model/types/post";
import { PostCard } from "src/entities/Post/ui/PostCard";

import { Avatar } from "src/shared/ui/Avatar";
import { Button } from "src/shared/ui/Button";
import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";
import { Textarea } from "src/shared/ui/Textarea";
import { useToast } from "src/shared/lib/hooks/useToast";

import cls from "./ProfilePage.module.less";

interface ProfileUser {
    id: string;
    username: string;
    picture?: string | null;
    description?: string | null;
    createdAt: string;
}

interface UserProfileQueryData {
    userProfile: ProfileUser;
    postsByUser: PostModel[];
}

const ProfilePage = () => {
    const router = useRouter();
    const auth = useSelector(getAuth);
    const toast = useToast();

    const rawUserId = router.query.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    const { data, loading, error, refetch } = useQuery<UserProfileQueryData>(
        GET_USER_PROFILE,
        {
            variables: { id: userId },
            skip: !userId
        }
    );

    const [updateMyDescription, { loading: isSaving }] = useMutation(
        UPDATE_MY_DESCRIPTION
    );

    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
        setDescription(data?.userProfile.description ?? "");
    }, [data?.userProfile.description]);

    if (loading || !userId) {
        return <LoaderIcon />;
    }

    if (error || !data?.userProfile) {
        return (
            <div className="container">
                <div className={cls.ProfileError}>Профиль не найден</div>
            </div>
        );
    }

    const profile = data.userProfile;
    const isOwner = auth.isLoggedIn && auth.user.id === profile.id;
    const registrationDate = new Date(profile.createdAt).toLocaleDateString(
        "ru-RU",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    const saveDescription = async () => {
        try {
            await updateMyDescription({
                variables: {
                    description: description.trim() || null
                }
            });

            await refetch();
            setIsEditing(false);
            toast.success({ message: "Описание сохранено" });
        } catch {
            toast.error({ message: "Не удалось сохранить описание" });
        }
    };

    const cancelEditing = () => {
        setDescription(profile.description ?? "");
        setIsEditing(false);
    };

    return (
        <>
            <Head>
                <title>Профиль {profile.username}</title>
            </Head>

            <main className="container">
                <section className={cls.Profile}>
                    <div className={cls.ProfileHeader}>
                        <Avatar src={profile.picture || ""} size="lg" />

                        <div className={cls.ProfileIdentity}>
                            <h1>{profile.username}</h1>
                            <span>На форуме с {registrationDate}</span>
                        </div>
                    </div>

                    <div className={cls.ProfileDescription}>
                        <div className={cls.ProfileDescriptionTitle}>
                            <h2>О себе</h2>
                            {isOwner && !isEditing && (
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Изменить
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <Textarea
                                value={description}
                                maxLength={300}
                                fullWidth
                                onChange={(event) => setDescription(event.target.value)}
                                footer={
                                    <div className={cls.ProfileDescriptionActions}>
                                        <Button
                                            size="sm"
                                            loading={isSaving}
                                            onClick={saveDescription}
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            disabled={isSaving}
                                            onClick={cancelEditing}
                                        >
                                            Отмена
                                        </Button>
                                    </div>
                                }
                            />
                        ) : (
                            <p>
                                {profile.description || "Описание пока не добавлено."}
                            </p>
                        )}
                    </div>

                    <div className={cls.ProfilePosts}>
                        <h2>Посты пользователя</h2>

                        {data.postsByUser.length > 0 ? (
                            <div className={cls.ProfilePostsList}>
                                {data.postsByUser.map((post) => (
                                    <PostCard key={post.id} {...post} />
                                ))}
                            </div>
                        ) : (
                            <p className={cls.ProfileNoPosts}>Постов пока нет.</p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ProfilePage;