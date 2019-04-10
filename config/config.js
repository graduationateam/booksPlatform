import routes from './route.config';

const isDev = process.env.NODE_ENV === 'development'; // 开发环境
const CrossDomainURL = "http://193.112.3.203:8080";
const CrossDomainURL2 = "http://192.168.191.4:8080";
const upload='/sys/file/upload';// 上传图片的地
const api='/api';

// ref: https://umijs.org/config/
export default {
  lessLoaderOptions: {
    rules: [{
      test: /\.less$/,
      loader: 'less-loader' // compiles Less to CSS
    }]
  },
  autoprefixer: {
    browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie> 8'],
    flexbox: true
  },
  "theme": {
    "primary-color": "#6fc400",
    'link-color': '#333',
    'text-color': '#333',
    'text-color-secondary': '#b3b3b3',
    'success-color': '#6fc400',
    'error-color': '#ff2727',
    'body-background': '#f7f7f7',
    'link-hover-color': '#6fc400',
    'border-color-base': '#e6e6e6',
  },
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'zhjx_web',
      dll: true,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  //路由配置
  routes:routes,
  proxy: {
    "/sys/": {
      target: CrossDomainURL,
      changeOrigin: true,
      /* pathRewrite: {
        "^/sys": ""
      } */
    },
    "/api/": {
      target: CrossDomainURL,
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      }
    },
    "/books/": {
      target: CrossDomainURL2,
      changeOrigin: true,
      pathRewrite: {
        "^/books": ""
      }
    },
  },

  // 是否开启 hash 文件后缀
  hash: true,

  // base: isDev ? '' : BASE_URL,
  // publicPath: isDev ? '' : BASE_URL
}
