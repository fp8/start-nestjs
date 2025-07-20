const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
    /**
     * Ignore the modules that are optional for nestjs.  These
     * modules are ignored as they cannot be resolved.
     */
    const lazyImports = [
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
    ];

    return {
        ...options,
        mode: 'production',
        externals: [],
        devtool: 'source-map',
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
            // Override the output path to build directory
            path: resolve(__dirname, 'build'),
            clean: true,
        },
        optimization: {
            minimize: true,
            usedExports: true,
            sideEffects: false,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            // Disable most compression options that might break jlog-facade
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log'],
                            dead_code: true,
                            unused: true,
                        },
                        mangle: {
                            // Must keep the class names for jlog-facade and class-transformer
                            keep_classnames: true,
                            keep_fnames: true,
                        },
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                    parallel: true,
                }),
            ],
        },
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
