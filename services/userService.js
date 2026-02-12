const User = require("../models/user");

exports.createUser = async (userData) => {
  return await User.create(userData);
};

exports.getUsers = async ({ filter, sortCriteria, skip, limit }) => {
  const users = await User.find(filter)
    .sort(sortCriteria)
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);

  return { users, totalUsers };
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(
    id,
    data,

    {
      returnDocument: "after",
    },
  );
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

exports.deleteAllUsers = async () => {
  return await User.deleteMany({});
};
