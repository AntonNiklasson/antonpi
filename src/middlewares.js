export function passwordProtection(req, res, next) {
  const ANTONPI_PASSWORD = process.env.ANTONPI_PASSWORD

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
