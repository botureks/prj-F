import { LoaderIcon } from "src/shared/ui/Icons/LoaderIcon";

import cls from "./Loader.module.less";

export const Loader = () => {
    return (
        <div className={cls.Loader}>
            <LoaderIcon/>
        </div>
    )
}