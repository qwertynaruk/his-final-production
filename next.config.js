module.exports = {
    exportPathMap: async function () {
      return {
        '/': { page: '/' },
        '/api/vendor': { page: '/api/vendor' },
        '/api/search/[name]': { page: '/api/search/[name]' }
      }
    },
}