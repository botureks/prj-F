import cls from "./ErrorPage.module.less";

export const ErrorPage = () => {
    const reloadPage = () => {
        location.reload();
    }

    return (
        <div className={ cls.ErrorPage }>
            <p>Произошла внезапная ошибка</p>

            <button onClick={ reloadPage }>Перезагрузить страницу</button>
        </div>
    )
}