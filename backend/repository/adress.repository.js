import Address from "../model/adress.js";

// Add new address
export const createAddress = async (userId, addressData) => {
  const address = new Address({ ...addressData, user: userId });
  await address.save();
  return address;
};

// Get all addresses for a user
export const getAddressesByUser = async (userId) => {
  return await Address.find({ user: userId });
};

// Update address
export const updateAddress = async (userId, addressId, newData) => {
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    newData,
    { new: true }
  );
  return address;
};

// Delete address
export const deleteAddress = async (userId, addressId) => {
  const result = await Address.findOneAndDelete({ _id: addressId, user: userId });
  return result;
};
