const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
    const lazyImports = [
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
    ];

    const optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // Disable most compression options that might break jlog-facade
                        drop_console: false,
                        drop_debugger: false,
                    },
                    mangle: {
                        // Must keep the class names for jlog-facade and class-transformer
                        keep_classnames: true,
                    },
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    };

    return {
        ...options,
        externals: [],
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    exclude: [/node_modules/],
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.build.json"
                    }
                }
            ]
        },
        output: {
            path: resolve(__dirname, 'build'),
        },
        optimization,
        plugins: [
            ...options.plugins,
            new webpack.IgnorePlugin({
                checkResource(resource) {
                    if (lazyImports.includes(resource)) {
                        try {
                            require.resolve(resource);
                        } catch (err) {
                            return true;
                        }
                    }
                    return false;
                },
            }),
        ],
    };
};
