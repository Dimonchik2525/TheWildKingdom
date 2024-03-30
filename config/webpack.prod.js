import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import fs from 'fs';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from "terser-webpack-plugin";

const srcFolder = "src";
const builFolder = "dist";
const rootFolder = path.basename(path.resolve());

const paths = {
   src: path.resolve(srcFolder),
   build: path.resolve(builFolder)
}
const htmlFiles = fs.readdirSync(`${srcFolder}`).filter(file => file.endsWith('.html'));

const config = {
   mode: 'production',
   cache: {
      type: 'filesystem'
   },
   optimization: {
      minimizer: [new TerserPlugin({
         extractComments: false,
      })],
   },
   output: {
      path: `${paths.build}`,
      filename: "../js/[name].[contenthash:8].min.js",
      publicPath: builFolder,
      //filename: 'app.min.js',
      //publicPath: '/',
      clean: true,
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: 'ts-loader',
                  options: {
                     transpileOnly: true
                  }
               }
            ]
         },
         {
            test: /\.(?:js|mjs|cjs|jsx)$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env', ["@babel/preset-react", {
                     runtime: 'automatic'
                  }]]
               }
            }
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               // Creates `style` nodes from JS strings
               MiniCssExtractPlugin.loader,
               {
                  loader: 'string-replace-loader',
                  options: {
                     search: '@img',
                     replace: '../img',
                     flags: 'g'
                  }
               },
               // Translates CSS into CommonJS
               {
                  loader: 'css-loader',
                  options: {
                     importLoaders: 0,
                     sourceMap: false,
                     modules: false,
                     url: {
                        filter: (url, resourcePath) => {
                           if (url.includes("img") || url.includes("fonts")) {
                              return false;
                           }
                           return true;
                        },
                     },
                  },
               },
               // Compiles Sass to CSS
               {
                  loader: 'sass-loader',
                  options: {
                     sassOptions: {
                        outputStyle: "expanded",
                     },
                  }
               },
            ],
         }
      ]
   },
   plugins: [
      ...htmlFiles.map(file => {
         return new HtmlWebpackPlugin({
            minify: false,
            template: path.resolve(paths.src, file), // Path to each HTML file
            filename: `../${file}`, // Output filename in the dist folder
         });
      }),
      new MiniCssExtractPlugin({
         filename: "../css/[name].[contenthash:8].css",
         //chunkFilename: "../css/[name].[contenthash:8].css",
      }),
      new CopyPlugin({
         patterns: [{
            from: `${srcFolder}/files`, to: `../files`,
            noErrorOnMissing: true,
            force: true
         }, {
            from: `${paths.src}/favicon.ico`, to: `../`,
            noErrorOnMissing: true
         },
         ],
      }),
   ],
   resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
         "@scss": `${paths.src}/scss`,
         "@js": `${paths.src}/js`,
         "@img": `${paths.src}/img`
      },
   }

}

export default config