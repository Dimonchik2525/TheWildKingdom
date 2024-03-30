import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import fs from 'fs';
import CopyPlugin from 'copy-webpack-plugin';


const srcFolder = "src";
const builFolder = "dist";
const rootFolder = path.basename(path.resolve());

const paths = {
   src: path.resolve(srcFolder),
   build: path.resolve(builFolder)
}
const htmlFiles = fs.readdirSync(`${srcFolder}`).filter(file => file.endsWith('.html'));

const htmlPlugins = htmlFiles.map(file => {
   return new HtmlWebpackPlugin({
      template: path.resolve(paths.src, file), // Path to each HTML file
      filename: `${file}`, // Output filename in the dist folder
   });
});

const config = {
   mode: 'development',
   entry: [
      `${paths.src}/js/index.js`,

   ],
   output: {
      path: `${paths.build}`,
      filename: "[name].[contenthash:8].js",
      //clean: true,
   },
   devServer: {
      historyApiFallback: true,
      static: paths.build,
      compress: true,
      open: true,
      port: 'auto',
      hot: true,
      host: 'local-ip',
      /*devMiddleware: {
         writeToDisk: true,
      },*/
      watchFiles: [
         `${paths.src}/**/*.html`,
         `${paths.src}/img/**/*.*`,
         `${paths.src}/scss/**/*.*`,
      ],
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
               //MiniCssExtractPlugin.loader,
               'style-loader',
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
                     importLoaders: 1,
                     sourceMap: true,
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
                     sourceMap: true,
                  }
               },
            ],
         },

      ]
   },
   plugins: [
      ...htmlPlugins,
      /* new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
          chunkFilename: "css/[name].[contenthash:8].css",
       }),*/
      new CopyPlugin({
         patterns: [
            {
               from: `${srcFolder}/img`, to: `img`,
               noErrorOnMissing: true,
               force: true
            }, {
               from: `${srcFolder}/files`, to: `files`,
               noErrorOnMissing: true,
               force: true
            }, {
               from: `${paths.src}/favicon.ico`, to: `./`,
               noErrorOnMissing: true
            },
         ],
      }),
   ],
   resolve: {
      extensions: ['.tsx', '.jsx', '.ts', '.js'],
      alias: {
         "@scss": `${paths.src}/scss`,
         "@js": `${paths.src}/js`,
         "@img": `${paths.src}/img`
      },
   }

}

export default config