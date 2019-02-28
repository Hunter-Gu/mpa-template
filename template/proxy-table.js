if (typeof window !== 'undefined')
  console.log('You SHOULD NOT reuqire proxy.table in client side')

module.exports = {
  test: {
    portal: "http://api.test.com"
  }
}
