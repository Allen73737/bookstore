export const getCartFromStorage = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getWishlistFromStorage = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const saveWishlistToStorage = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};
