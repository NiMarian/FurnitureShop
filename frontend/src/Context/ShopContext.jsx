import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
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
        const response = await fetch('http://localhost:4000/allproducts');
        const data = await response.json();
        setAll_Product(data);
      } catch (error) {
        console.error("Eroare la preluarea produselor:", error);
      }
    };

    fetchProducts();

    const savedCart = getCartFromLocalStorage();
    if (typeof savedCart === 'object' && savedCart !== null) {
      setCartItems(savedCart);
    } else {
      setCartItems(getDefaultCart());
    }

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/getcart', {
        method: 'POST',
        headers: {
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json())
        .then((data) => {
          if (typeof data === 'object' && data !== null) {
            setCartItems(data);
            saveCartToLocalStorage(data);
          } else {
            setCartItems(getDefaultCart());
          }
        });
    }
  }, []);


  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [itemId]: prev[itemId] + 1 };
      saveCartToLocalStorage(newCart);
      return newCart;
    });
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId })
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [itemId]: prev[itemId] - 1 };
      saveCartToLocalStorage(newCart);
      return newCart;
    });
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId })
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }

  const updateCartItemQuantity = (itemId, quantity) => {
    setCartItems((prev) => {
      const newCart = { ...prev, [itemId]: quantity };
      saveCartToLocalStorage(newCart);
      return newCart;
    });
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/updatecartitemquantity', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "itemId": itemId, "quantity": quantity })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

        });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo && itemInfo.new_price !== undefined) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  }

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  }

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
    setCartItems
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;