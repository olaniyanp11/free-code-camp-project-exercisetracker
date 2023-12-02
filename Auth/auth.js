const auth = (req, res, next) => {
  let browser = req.get("User-Agent");
  console.log(`${req.method} request from ${req.ip}to ${req.path}`);
  next();
};
module.exports =auth