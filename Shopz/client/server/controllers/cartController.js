import { Cart } from '../models/Schema.js';

// ✅ Fetch only logged-in user's cart items
export const fetchCartItems = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id }); 
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

// ✅ Add to cart for logged-in user
export const addToCart = async (req, res) => {
  const { title, description, mainImg, size, quantity, price, discount } = req.body;

  try {
    const item = new Cart({
      userId: req.user.id,   // 🔥 FIXED
      title,
      description,
      mainImg,
      size,
      quantity,
      price,
      discount
    });

    await item.save();
    res.json({ message: 'Added to cart' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error occurred' });
  }
};

// ✅ Increase quantity (only if item belongs to user)
export const increaseCartQuantity = async (req, res) => {
  const { id } = req.body;

  try {
    const item = await Cart.findOne({ _id: id, userId: req.user.id }); // 🔥 FIXED
    if (!item) return res.status(404).json({ message: 'Item not found or not yours' });

    item.quantity = parseInt(item.quantity) + 1;
    await item.save();

    res.json({ message: 'Incremented' });

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

// ✅ Decrease quantity (only if item belongs to user)
export const decreaseCartQuantity = async (req, res) => {
  const { id } = req.body;

  try {
    const item = await Cart.findOne({ _id: id, userId: req.user.id }); // 🔥 FIXED
    if (!item) return res.status(404).json({ message: 'Item not found or not yours' });

    item.quantity = parseInt(item.quantity) - 1;
    await item.save();

    res.json({ message: 'Decremented' });

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

// ✅ Remove item (only if item belongs to user)
export const removeItemFromCart = async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id   // 🔥 FIXED
    });

    if (!item) return res.status(404).json({ message: 'Item not found or not yours' });

    res.json({ message: 'Item removed' });

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};
