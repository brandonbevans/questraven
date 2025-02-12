// next.config.js
const withSvgr = require('next-svgr');

module.exports = withSvgr({
  compiler: {
    removeConsole: process.env.VERCEL_ENV === 'production'
  }
  // any other Next.js config here
});
