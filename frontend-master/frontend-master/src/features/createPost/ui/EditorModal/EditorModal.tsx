import { useCallback, useRef, useState } from "react";

import { createReactEditorJS } from "react-editor-js";
import { EditorCore } from "@react-editor-js/core";

import { useMutation } from "@apollo/client";

import {
    BLOCKS_TO_TITLE,
    EDITOR_DATA,
    EDITOR_DEFAULT,
    EDITOR_I18n,
    EDITOR_TOOLS,
    TOPICS,
} from "src/shared/const/editorjs.settings";

import { Modal } from "src/shared/ui/Modal";
import { Button } from "src/shared/ui/Button";
import { CloseIcon } from "src/shared/ui/Icons/CloseIcon";

import { useToast } from "src/shared/lib/hooks/useToast";

import { ModalProps } from "src/shared/ui/Modal/interfaces/ModalProps.interface";

import { ListboxPicker } from "src/shared/ui/Listbox/ui/ListboxPicker";

import CREATE_POST from "src/entities/Post/api/gql/create-post.model";
import UPDATE_POST from "src/entities/Post/api/gql/update-post.model";
import GET_POST from "src/entities/Post/api/gql/get-post.model";

import { PostEntity } from "src/shared/api/generated/graphql";

import cls from "src/shared/ui/Modal/Modal.module.less";
import editorCls from "./EditorModal.module.less";

const ReactEditorJS = createReactEditorJS();

interface EditorModalProps extends ModalProps {
    post?: PostEntity;
}

export const EditorModal = (props: EditorModalProps) => {
    const {
        isOpen,
        onClose,
        post
    } = props;

    const editorCore = useRef<EditorCore>(null);

    const toast = useToast();

    const [topic, setTopic] = useState(post?.topic ?? "");

    const [isLoading, setLoading] = useState(false);

    const [isPublishButtonDisabled, setIsPublishButtonDisabled] = useState(
        post ? false : true
    );

    const [createPost] = useMutation(CREATE_POST);
    const [updatePost] = useMutation(UPDATE_POST);

    const changeTopic = (topic: string) => setTopic(topic);

    const handleInitialize = useCallback((instance: EditorCore) => {
        // @ts-ignore
        editorCore.current = instance;
    }, []);

    const onChange = async () => {
        if (!editorCore.current) {
            return;
        }

        const data = await editorCore.current.save();
        const title = BLOCKS_TO_TITLE(data.blocks);

        setIsPublishButtonDisabled(title.length === 0);
    };

    const handleSave = async () => {
        setLoading(true);

        if (!editorCore.current) {
            setLoading(false);
            return;
        }

        const data = await editorCore.current.save();
        const title = BLOCKS_TO_TITLE(data.blocks);

        try {
            if (post) {
                await updatePost({
                    variables: {
                        id: post.id,
                        title,
                        content: JSON.stringify(data),
                    },
                    refetchQueries: [
                        {
                            query: GET_POST,
                            variables: {
                                id: post.id
                            }
                        }
                    ]
                });

                toast.success({
                    message: "Пост был обновлён"
                });
            } else {
                await createPost({
                    variables: {
                        title,
                        topic,
                        content: JSON.stringify(data)
                    },
                });

                toast.success({
                    message: "Пост был создан"
                });
            }

            onClose();

        } catch (err) {
            toast.error({
                message: "Произошла ошибка"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            lazy
        >
            <div className={editorCls.EditorModal}>
                <div
                    className={cls.ModalBody}
                    content-type="full"
                >
                    <header>
                        <button onClick={onClose}>
                            <CloseIcon />
                        </button>
                    </header>

                    <div
                        id="content-box"
                        className={editorCls.EditorModalContent}
                    >
                        <div id="content">

                            {!post && (
                                <ListboxPicker
                                    initialItems={TOPICS}
                                    onSelect={changeTopic}
                                />
                            )}

                            {/* @ts-ignore */}
                            <ReactEditorJS
                                tools={EDITOR_TOOLS as any}
                                defaultBlock={EDITOR_DEFAULT}
                                i18n={EDITOR_I18n}
                                defaultValue={
                                    post
                                        ? JSON.parse(post.content)
                                        : EDITOR_DATA
                                }
                                inlineToolbar={[
                                    "link",
                                    "marker",
                                    "bold",
                                    "italic"
                                ]}
                                onInitialize={handleInitialize}
                                onChange={onChange}
                            />

                            <Button
                                size="lg"
                                loading={isLoading}
                                onClick={handleSave}
                                className={editorCls.EditorPublishBtn}
                                disabled={isPublishButtonDisabled}
                            >
                                {post ? "Сохранить" : "Опубликовать"}
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};