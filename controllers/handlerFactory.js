const AppError = require('../utils/appError');

function deleteOne(Model) {
  return async function (req, res, next) {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(
          new AppError('No document found with that ID', 404),
        );
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  deleteOne,
};
