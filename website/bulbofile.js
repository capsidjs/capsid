const bulbo = require('bulbo')
const { asset } = bulbo

const src = 'src'

const paths = {
  CNAME: 'CNAME',
  html: `${src}/**/*.*`,
  asset: `asset/**/*.*`
}

bulbo.base('.')
bulbo.port(9001)

asset(paths.html).base(src)
asset(paths.asset)
asset(paths.CNAME)
