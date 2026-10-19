const withLess = require("next-with-less");
const dotenv = require('dotenv');

dotenv.config({
    path: '.env'
});

console.log(process.env.GRAPHQL_URL)

/** @type {import('next').NextConfig} */
const nextConfig = withLess({
    output: 'standalone',
    reactStrictMode: false,
    transpilePackages: ['react-redux', '@reduxjs/toolkit', 'react-dropzone'],
    experimental: {
        esmExternals: false,
    },
    styledComponents: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            Object.assign(config.resolve.alias, {
                react: "preact/compat",
                "react-dom/test-utils": "preact/test-utils",
                "react-dom": "preact/compat",
            });
        }
        return config;
    },
    env: {
        GRAPHQL_URL: process.env.GRAPHQL_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "forum.ranobe.dev",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "9000",
            }
        ]
    }
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false
});

module.exports = withBundleAnalyzer(nextConfig);

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
    module.exports,
    {
        org: "celis-51",
        project: "forum_frontend",
        url: "https://track.foxovh.me/",

        silent: true,

        widenClientFileUpload: true,
        transpileClientSDK: true,
        tunnelRoute: "/monitoring",
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: true,

        // Отключаем загрузку sourcemaps если нет токена (Docker-сборка, локальная разработка)
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
    }
);
