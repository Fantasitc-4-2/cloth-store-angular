import * as repository from "../repository/adress.repository.js";


// Create new address
export const createAddress = async (req, res) => {
  try {
    const address = await repository.createAddress(req.user.id, req.body);
    res.status(201).json({ message: "Address added successfully", address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add address" });
  }
};

// Get all user addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await repository.getAddressesByUser(req.user.id);
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const address = await repository.updateAddress(
      req.user.id,
      req.params.addressId,
      req.body
    );
    if (!address) return res.status(404).json({ error: "Address not found" });
    res.json({ message: "Address updated", address });
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const deleted = await repository.deleteAddress(
      req.user.id,
      req.params.addressId
    );
    if (!deleted) return res.status(404).json({ error: "Address not found" });
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete address" });
  }
};
