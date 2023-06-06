/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    // TODO: base：系统基础数据维护
    '/apiBase/': {
      // 要代理的地址
      target: 'http://106.52.125.82:8080/',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: {
        '^/apiBase': '/base/web',
      },
    },
    // TODO: engine：
    '/apiEngine/': {
      // 要代理的地址
      target: 'http://106.52.125.82:8080/',
      changeOrigin: true,
      pathRewrite: {
        '^/apiEngine': '/engine/web',
      },
    },
    // TODO: accounting
    '/apiAccounting/': {
      // 要代理的地址
      target: 'http://106.52.125.82:8080/',
      changeOrigin: true,
      pathRewrite: {
        '^/apiAccounting': '/accounting/web',
      },
    },
    // TODO: Smart 1.0 后台地址
    '/apiLocal/': {
      // 要代理的地址
      // target: 'http://localhost:52663/',
      target: 'http://cargo2.sinotranshk.com/',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: {
        '^/apiLocal': '/api',
      },
    },
    // TODO: 乾坤子系统代理地址
    '/childapi/api/': {
      // 要代理的地址
      target: 'http://localhost:52663/',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: {
        '^/childapi/api': '/api',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
