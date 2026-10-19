import edjsHTML from "editorjs-html";

interface PostProps {
    content: string;
}

export const Post = (props: PostProps) => {
    const parsed = JSON.parse(props.content);
    const content = Array.isArray(parsed) ? { blocks: parsed } : parsed;
    const parser = edjsHTML();
    const html = parser.parse(content);

    return (
        <div dangerouslySetInnerHTML={{ __html: html.join('') }} />
    );
}
