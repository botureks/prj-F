// import { Avatar } from "../../../../shared/ui/Avatar";
// import { formatDate } from "../../../../shared/lib/utils";
// import { UserEntity } from "../../../../shared/api/generated/graphql";

// import cls from "./PostUserMetadata.module.less";

// interface PostUserMetadataProps {
//     author: UserEntity;
//     topic?: string;
//     createdAt: string;
// }

// const NO_TOPIC = 'Без темы';

// export const PostUserMetadata = (props: PostUserMetadataProps) => {
//     const { author, topic, createdAt } = props;

//     return (
//         <div className={cls.PostUserMetadata}>
//             <div className={cls.PostUserMetadataAuthor}>
//                 <Avatar src={ author.picture || "" } size="sm" />
//                 <a>{author.username}</a>

//                 <div className={cls.PostUserInfo}>
//                     {topic !== NO_TOPIC && <a>{topic}</a>}
//                     <span>{formatDate(createdAt)}</span>
//                 </div>
//             </div>
//         </div>
//     )
// }






import { Avatar } from "../../../../shared/ui/Avatar";
import { formatDate } from "../../../../shared/lib/utils";
import { UserEntity } from "../../../../shared/api/generated/graphql";

import cls from "./PostUserMetadata.module.less";

interface PostUserMetadataProps {
    author: UserEntity;
    topic?: string;
    createdAt: string;
}

const NO_TOPIC = 'Без темы';

export const PostUserMetadata = (props: PostUserMetadataProps) => {
    const { author, topic, createdAt } = props;

    return (
        <div className={cls.PostUserMetadata}>
            <div className={cls.PostUserMetadataAuthor}>
                <Avatar src={ author.picture || "" } size="sm" />
                <a>{author.username}</a>

                <div className={cls.PostUserInfo}>
                    {topic !== NO_TOPIC && <a>{topic}</a>}
                    <span>{formatDate(createdAt)}</span>
                </div>
            </div>
        </div>
    )
}