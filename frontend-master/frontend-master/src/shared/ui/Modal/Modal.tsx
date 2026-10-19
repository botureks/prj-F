import { ReactNode } from "react";

import { useModal } from "src/shared/lib/hooks/useModal";
import { Portal } from "src/shared/ui/Portal";

import { useOutsideClick } from "src/shared/lib/hooks/useOutsideClick";

import cls from "./Modal.module.less";

interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    lazy?: boolean;
}

const ANIMATION_DELAY = 200;

export const Modal = (props: ModalProps) => {
    const { children, isOpen, onClose, lazy } = props;

    const ref = useOutsideClick(() => onClose && onClose());

    const { isMounted } = useModal({
        animationDelay: ANIMATION_DELAY,
        onClose,
        isOpen,
    });

    if (lazy && !isMounted) {
        return null;
    }

    return (
        <Portal element={document.getElementById('__next') ?? document.body}>
            <div className={cls.Modal}>
                <section ref={ ref }>
                    {children}
                </section>
            </div>
        </Portal>
    )
}