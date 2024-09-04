import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [userDetails, setUserDetails] = useState(null);

  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  };

  const getCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : getDefaultCart();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://furnitureshop-backend.onrender.com/allproducts');
        const data = await response.json();
        setAll_Product(data);
      } catch (error) {
        console.error("Eroare la preluarea produselor:", error);
      }
    };

    fetchProducts();

    const savedCart = getCartFromLocalStorage();
    setCartItems(savedCart);

    const fetchUserDetails = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await fetch('https://furnitureshop-backend.onrender.com/user', {
            headers: {
              'auth-token': token,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const text = await response.text();
            console.error('Serverul a returnat o eroare.:', response.status, text);
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setUserDetails(data.user);
          } else {
            const text = await response.text();
            console.error('Formatul răspunsului este neașteptat:', text);
            throw new Error('Serverul a returnat un format de răspuns neașteptat');
          }
        } catch (error) {
          console.error("Eroare la preluarea detaliilor utilizatorului:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [itemId]: prev[itemId] + quantity };
      saveCartToLocalStorage(newCart);
      return newCart;
    });

    if (localStorage.getItem('auth-token')) {
      fetch('https://furnitureshop-backend.onrender.com/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity })
      }).then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [itemId]: Math.max(0, prev[itemId] - 1) };
      saveCartToLocalStorage(newCart);
      return newCart;
    });

    if (localStorage.getItem('auth-token')) {
      fetch('https://furnitureshop-backend.onrender.com/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId })
      }).then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const updateCartItemQuantity = (itemId, quantity) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [itemId]: quantity };
      saveCartToLocalStorage(newCart);
      return newCart;
    });

    if (localStorage.getItem('auth-token')) {
      fetch('https://furnitureshop-backend.onrender.com/updatecartitemquantity', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity })
      }).then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const clearCart = () => {
    const emptyCart = getDefaultCart();
    setCartItems(emptyCart);
    saveCartToLocalStorage(emptyCart);

    if (localStorage.getItem('auth-token')) {
      fetch('https://furnitureshop-backend.onrender.com/clearcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      }).then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo && itemInfo.new_price_with_tva !== undefined) {
          totalAmount += itemInfo.new_price_with_tva * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    promoCode,
    setPromoCode,
    discount,
    total,
    updateCartItemQuantity,
    setCartItems,
    clearCart,
    userDetails,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
