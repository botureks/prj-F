import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { classNames } from "src/shared/lib/classNames";

import { useHeaderFixed } from "src/widgets/Header/lib";

import { Button } from "src/shared/ui/Button";
import { Avatar } from "src/shared/ui/Avatar";

import { Listbox } from "src/shared/ui/Listbox/Listbox";
import { ListboxTrigger } from "src/shared/ui/Listbox/ui/ListboxTrigger";
import { ListboxItems } from "src/shared/ui/Listbox/ui/ListboxItems";
import { ListboxItem } from "src/shared/ui/Listbox/ui/ListboxItem";

import { LoginModal } from "src/features/authByUsername/ui/LoginModal";

import { useTheme } from "src/shared/lib/hooks/useTheme";
import { useLogout } from "src/shared/lib/hooks/useLogout";

import { getAuth } from "src/entities/Auth/model/selectors/getAuth";

import { WriteIcon } from "src/shared/ui/Icons/WriteIcon";

import { EditorModal } from "src/features/createPost/ui/EditorModal";

import { Switch } from "src/shared/ui/Switch";
import { UserCardWithUpload } from "src/shared/ui/Cards/UserCardWithUpload";

import { Theme } from "src/shared/const/theme";

import { Logo } from "./Logo";

import cls from "./Header.module.less";

export const Header = () => {
    const { isFixed } = useHeaderFixed();

    const {
        theme,
        toggleTheme
    } = useTheme();

    const auth = useSelector(getAuth);
    const { logout } = useLogout();

    const [isAuthModal, setIsAuthModal] = useState(false);
    const [isCreatePostModal, setCreatePostModal] = useState(false);

    const onCloseModal = useCallback(() => {
        setIsAuthModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAuthModal(true);
    }, []);

    const toggleCreateModal = () => setCreatePostModal((prevState) => !prevState);

    return (
        <header
            className={
                classNames(cls.Header, {
                    [cls.fixed]: isFixed
                })
            }
        >
            <div className={ cls.HeaderContainer }>
                <div>
                    <Logo/>
                </div>

                <div>
                    {
                        auth.isLoggedIn ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="md"
                                    onClick={toggleCreateModal}
                                    icon={<WriteIcon />}
                                >
                                    Написать
                                </Button>

                                <Listbox>
                                    <ListboxTrigger>
                                        <Avatar size="lg" src={ auth.user.picture ?? undefined }/>
                                    </ListboxTrigger>
                                    <ListboxItems>
                                        <UserCardWithUpload user={ auth.user }/>
                                        <Switch
                                            label="Тема"
                                            size="sm"
                                            selected={ theme === Theme.LIGHT }
                                            onValueChange={toggleTheme}
                                        />
                                        <ListboxItem
                                            title="Выйти из аккаунта"
                                            onClick={logout}
                                        />
                                    </ListboxItems>
                                </Listbox>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                size="md"
                                onClick={onShowModal}
                            >
                                Войти
                            </Button>
                        )
                    }
                </div>
            </div>

            {isAuthModal && (
                <LoginModal isOpen={isAuthModal} onClose={onCloseModal} />
            )}

            {isCreatePostModal && (
                <EditorModal isOpen={isCreatePostModal} onClose={toggleCreateModal} />
            )}
        </header>
    );
};