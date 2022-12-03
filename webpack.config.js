const path = require("path");

module.exports = {
    devtool: "inline-source-map",
    mode: "development",
    target: "web",
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    "postcss-loader",
                    
                ],
            },
        ]
    },
    entry: [
        "./src/core.js",
        "./src/stylesheets/core.scss"
    ],
    output: {
        filename: 'fo.dist.js',
        path: path.resolve(__dirname, 'app')
    },
    resolve: {
        fallback: {
          "fs": false,
          "tls": false,
          "net": false,
          "path": false,
          "zlib": false,
          "http": false,
          "https": false,
          "stream": false,
          "crypto": false,
        } 
      },
};
