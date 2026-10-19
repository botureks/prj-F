import { ChangeEvent, useRef, useState } from "react";

import { useMutation } from "@apollo/client";

import { Button } from "src/shared/ui/Button";
import { Textarea } from "src/shared/ui/Textarea";

import CREATE_COMMENT from "src/entities/Comment/api/gql/create-comment.module";
import { useSelector } from "react-redux";
import { getAuth } from "../../../../entities/Auth/model/selectors/getAuth";

interface CommentAreaProps {
    postId: string;
}

export const CommentArea = (props: CommentAreaProps) => {
    const { postId } = props;

    const auth = useSelector(getAuth);

    const [createComment, { loading }] = useMutation(CREATE_COMMENT);

    const ref = useRef<HTMLTextAreaElement>(null);

    const [text, setText] = useState('');

    const submit = () => {
        if (text.length === 0 || text.length > 200) return;

        const formattedText = text.replace(/\n/g, '<br/>');

        createComment({
            variables: {
                postId,
                content: formattedText
            }
        });

        if (ref.current) {
            ref.current.value = '';
            setText('');
        }
    }

    const updateText = (event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value);

    return (
        <Textarea
            ref={ ref }
            disabled={ loading || !auth.isLoggedIn }
            onChange={ updateText }
            footer={
                <Button
                    size="sm"
                    onClick={ submit }
                    disabled={ loading || !auth.isLoggedIn }
                >
                    Отправить
                </Button>
            }
        />
    )
}