import { useState } from "react";

import { Modal } from "src/shared/ui/Modal";

import { CloseIcon } from "src/shared/ui/Icons/CloseIcon";

import { LoginForm } from "src/features/authByUsername/ui/LoginForm";
import { RegisterForm } from "src/features/registerByUsername/ui/RegisterForm";

import { ModalProps } from "src/shared/ui/Modal/interfaces/ModalProps.interface";

import cls from "src/shared/ui/Modal/Modal.module.less";

export const LoginModal = (props: ModalProps) => {
    const { isOpen, onClose } = props;

    const [isLogin, setLogin] = useState(true);

    const onChange = () => setLogin((prevState) => !prevState);

    return (
        <Modal
            isOpen={ isOpen }
            onClose={ onClose }
            lazy
        >
            <div className={ cls.ModalBody }>
                <header>
                    <button onClick={onClose}>
                        <CloseIcon />
                    </button>
                </header>

                <div id="content-box">
                    <div id="content">
                        <a className={ cls.ModalTitle }>
                            {isLogin ? "Вход в аккаунт" : "Регистрация"}
                        </a>

                        {isLogin ?
                            <LoginForm
                                onChange={onChange}
                                onClose={onClose}
                            /> :
                            <RegisterForm
                                onChange={onChange}
                                onClose={onClose}
                            />
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}