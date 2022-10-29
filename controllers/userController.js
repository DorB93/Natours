const User = require('./../models/userModel');

function checkUserID(req, res, next, val) {
  /////////
  next();
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
}
function getUser(req, res) {
  const user = users.find((u) => u.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: users.length,
    data: {
      user,
    },
  });
}
function createUser(req, res) {
  res.status(201).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      users,
    },
  });
}
function updateUser(req, res) {
  const user = users.find((t) => t.id === +req.params.id);

  // console.log(req.body);
  const newUser = { ...user, ...req.body };

  // console.log(updateduser);
  const restUsers = users.filter((t) => t.id !== +req.params.id);
  const updatedUsers = [...restUsers, newUser].sort(
    (a, b) => a.id - b.id,
  );
  // console.log(updatedusers);

  fs.writeFile(userFileRoot, JSON.stringify(updatedUsers), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  });
}
function deleteUser(req, res) {
  const user = users.find((u) => u.id === +req.params.id);

  const updatedUsers = users.filter((u) => u.id !== +req.params.id);

  fs.writeFile(userFileRoot, JSON.stringify(updatedUsers), (err) => {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  checkUserID,
};
