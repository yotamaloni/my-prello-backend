const logger = require('../services/logger.service')

async function requireAdmin(req, res, next) {
  const user = req.session.user
  if (!user.isAdmin) {
    logger.warn(user.fullname + ' Attempt to perform admin action')
    res.status(403).end('Unauthorized Enough..')
    return
  }
  next()
}
module.exports = {
  requireAdmin
}
