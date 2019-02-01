module.exports = {
  passwordProtection: (req, res, next) => {
    if (ANTONPI_PASSWORD) {
      if (
        req.body.password !== ANTONPI_PASSWORD &&
        req.query.password !== ANTONPI_PASSWORD
      ) {
        return res.sendStatus(401)
      }
    }

    next()
  }
}
