import edjsHTML from "editorjs-html";

import cls from "./Post.module.less";

interface PostProps {
    content: string;
}

export const Post = (props: PostProps) => {
    const parsed = JSON.parse(props.content);
    const content = Array.isArray(parsed) ? { blocks: parsed } : parsed;
    const blocks = Array.isArray(content?.blocks) ? content.blocks : [];
    const parser = edjsHTML();

    return (
        <div>
            {blocks.map((block: any, index: number) => {
                if (block.type === "image" && block.data?.file?.url) {
                    return (
                        <img
                            key={block.id ?? index}
                            src={block.data.file.url}
                            alt="Изображение поста"
                            className={cls.ContentImage}
                        />
                    );
                }

                const html = parser.parse({ blocks: [block] } as any).join("");

                return (
                    <div
                        key={block.id ?? index}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                );
            })}
        </div>
    );
};