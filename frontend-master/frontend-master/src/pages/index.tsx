import Head from "next/head";

import { MainLayout } from "src/shared/layouts/MainLayout";

const IndexPage = () => {
    return (
        <>
            <Head>
                <title>Форум</title>
            </Head>

            <MainLayout/>
        </>
    );
};

export default IndexPage;
