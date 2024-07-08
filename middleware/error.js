module.exports = function (err, req, res, next) {
    res.status(err.status ?? 500);
    res.json({ error: err.message ?? 'Unknown Error' });
  };
  