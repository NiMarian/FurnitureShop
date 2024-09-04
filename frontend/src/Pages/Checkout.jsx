import React, { useState, useEffect, useContext } from 'react';
import './CSS/Checkout.css';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';

const Checkout = () => {
  const { cartItems, all_product, updateCartItemQuantity, clearCart, userDetails } = useContext(ShopContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [contactDetails, setContactDetails] = useState({ email: '' });
  const [vat] = useState(19);
  const [userAddresses, setUserAddresses] = useState([]);

  const [shippingDetails, setShippingDetails] = useState({
    country: 'Romania',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    postalCode: '',
    city: '',
    county: '',
    phone: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  });

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('https://furnitureshop-backend.onrender.com/addresses', {
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUserAddresses(data.addresses);
        } else {
          const text = await response.text();
          throw new Error('Serverul a returnat un format de răspuns neașteptat');
        }
      } catch (error) {
        console.error('Eroare la preluarea adreselor:', error);
      }
    };

    fetchUserAddresses();
  }, []);

  useEffect(() => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount(subtotal, discount);
    setDiscountValue(discountAmount);
  }, [cartItems, discount]);

  useEffect(() => {
    if (userDetails) {
      setContactDetails({ email: userDetails.email });
    }
  }, [userDetails]);

  const handleContactChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleSelectAddress = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedAddress = userAddresses[selectedIndex];
      setShippingDetails(selectedAddress);
      if (userDetails) {
        setContactDetails({ email: userDetails.email });
      }
    } else {
      setShippingDetails({
        country: 'Romania',
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        postalCode: '',
        city: '',
        county: '',
        phone: '',
      });
      setContactDetails({ email: '' });
    }
  };

  const applyPromoCode = async () => {
    try {
      const response = await fetch('https://furnitureshop-backend.onrender.com/checkpromocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await response.json();
      if (data.success) {
        const discountPercentage = data.discount;
        setDiscount(discountPercentage);
        const subtotal = getSubtotal();
        const discountAmount = getDiscountAmount(subtotal, discountPercentage);
        setDiscountValue(discountAmount);
        alert("Promo code aplicat");
      } else {
        alert("Promo code invalid");
      }
    } catch (error) {
      console.error("Eroare:", error);
      alert("Eroare la aplicarea promo code-ului");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'PayPal') {
      return;
    }

    const insufficientStockItems = Object.keys(cartItems).filter(itemId => {
      if (cartItems[itemId] > 0) {
        const product = all_product.find(product => product.id === parseInt(itemId));
        return !product || product.stock < cartItems[itemId];
      }
      return false;
    });

    if (insufficientStockItems.length > 0) {
      alert('Stocul este insuficient pentru unele produse din coș. Vă rugăm să actualizați cantitățile sau să eliminați produsele insuficiente din coș.');
      return;
    }

    const formattedCartItems = Object.keys(cartItems).map((itemId) => {
      const product = all_product.find((product) => product.id === parseInt(itemId));
      if (cartItems[itemId] > 0 && product) {
        return {
          productId: product.id,
          productName: product.name,
          quantity: cartItems[itemId],
          price: product.new_price_with_tva
        };
      }
      return null;
    }).filter(item => item !== null);

    const checkoutDetails = {
      contactDetails,
      shippingDetails,
      deliveryMethod,
      paymentMethod: 'PayPal',
      cardDetails: paymentMethod === 'Card' ? cardDetails : null,
      subtotal: getSubtotal(),
      shippingCost: getShippingCost(),
      total: getTotal(getSubtotal(), getShippingCost(), discount),
      promoCode,
      promoDiscount: discountValue,
      vat,
      cartItems: formattedCartItems
    };

    try {
      const response = await fetch('https://furnitureshop-backend.onrender.com/placeorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutDetails),
      });

      const data = await response.json();
      if (data.success) {
        alert('Comanda a fost plasată cu succes!');
        clearCart();
        navigate('/');
      } else {
        console.error('Eroare la plasarea comenzii:', data.message);
        alert('Eroare la plasarea comenzii: ' + data.message);
      }
    } catch (error) {
      console.error('Eroare la plasarea comenzii:', error);
      alert('Eroare la plasarea comenzii: ' + error.message);
    }
  };

  const handlePayPalSuccess = async () => {
    const insufficientStockItems = Object.keys(cartItems).filter(itemId => {
      if (cartItems[itemId] > 0) {
        const product = all_product.find(product => product.id === parseInt(itemId));
        return !product || product.stock < cartItems[itemId];
      }
      return false;
    });

    if (insufficientStockItems.length > 0) {
      alert('Stocul este insuficient pentru unele produse din coș. Vă rugăm să actualizați cantitățile sau să eliminați produsele insuficiente din coș.');
      return;
    }

    const formattedCartItems = Object.keys(cartItems).map((itemId) => {
      const product = all_product.find((product) => product.id === parseInt(itemId));
      if (cartItems[itemId] > 0 && product) {
        return {
          productId: product.id,
          productName: product.name,
          quantity: cartItems[itemId],
          price: product.new_price_with_tva
        };
      }
      return null;
    }).filter(item => item !== null);

    const checkoutDetails = {
      contactDetails,
      shippingDetails,
      deliveryMethod,
      paymentMethod: 'PayPal',
      cardDetails: null,
      subtotal: getSubtotal(),
      shippingCost: getShippingCost(),
      total: getTotal(getSubtotal(), getShippingCost(), discount),
      promoCode,
      promoDiscount: discountValue,
      vat,
      cartItems: formattedCartItems
    };

    try {
      const response = await fetch('https://furnitureshop-backend.onrender.com/placeorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutDetails),
      });

      const data = await response.json();
      if (data.success) {
        alert('Comanda a fost plasată cu succes!');
        clearCart();
        navigate('/');
      } else {
        console.error('Eroare la plasarea comenzii:', data.message);
        alert('Eroare la plasarea comenzii: ' + data.message);
      }
    } catch (error) {
      console.error('Eroare la plasarea comenzii:', error);
      alert('Eroare la plasarea comenzii: ' + error.message);
    }
  };

  const getDiscountAmount = (subtotal, discount) => (subtotal * discount) / 100;
  const getSubtotal = () => {
    let subtotal = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = all_product.find((product) => product.id === parseInt(itemId));
        if (product) {
          subtotal += product.new_price_with_tva * cartItems[itemId];
        }
      }
    }
    return subtotal;
  };

  const getShippingCost = () => {
    if (deliveryMethod === "Premium") {
      return 300;
    } else if (deliveryMethod === "Standard") {
      return 100;
    } else {
      return 0;
    }
  };

  const getTotal = (subtotal, shipping, discount) => subtotal + shipping - getDiscountAmount(subtotal, discount);

  const convertRONToUSD = async (amountInRON) => {
    try {
      const response = await fetch('https://furnitureshop-backend.onrender.com/convert-to-usd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInRON }),
      });
      const data = await response.json();
      if (data.success) {
        return data.amountInUSD;
      } else {
        console.error('Eroare la conversia în USD:', data.message);
        return amountInRON;
      }
    } catch (error) {
      console.error('Eroare la conversia în USD:', error);
      return amountInRON;
    }
  };

  const createOrder = async (data, actions) => {
    const totalInRON = getTotal(getSubtotal(), getShippingCost(), discount);
    const totalInUSD = await convertRONToUSD(totalInRON);
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalInUSD.toFixed(2)
        }
      }]
    });
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(handlePayPalSuccess);
  };

  return (
    <div className="checkout">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <select className='address-select' onChange={handleSelectAddress}>
            <option value="">Alege o adresă</option>
            {userAddresses.map((address, index) => (
            <option key={index} value={index}>
              {address.firstName} {address.lastName} - {address.address}, {address.city}, {address.county}
            </option>
          ))}
        </select>
        <form onSubmit={handleSubmit}>
          <h3>Detalii de contact</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={contactDetails.email}
            onChange={handleContactChange}
            required
          />
          <div className="checkout-name">
            <input
              type="text"
              name="firstName"
              placeholder="Prenume"
              value={shippingDetails.firstName}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Nume"
              value={shippingDetails.lastName}
              onChange={handleShippingChange}
              required
            />
          </div>
          <input
            type="text"
            name="company"
            placeholder="Compania (optional)"
            value={shippingDetails.company}
            onChange={handleShippingChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Adresa"
            value={shippingDetails.address}
            onChange={handleShippingChange}
            required
          />
          <div className="checkout-adresa">
            <input
              type="text"
              name="postalCode"
              placeholder="Cod Postal"
              value={shippingDetails.postalCode}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Localitatea"
              value={shippingDetails.city}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              name="county"
              placeholder="Judetul"
              value={shippingDetails.county}
              onChange={handleShippingChange}
              required
            />
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Telefon"
            value={shippingDetails.phone}
            onChange={handleShippingChange}
            required
          />
          <div className="checkout-deliverymethod">
            <h3>Metoda de livrare</h3>
            <label>
              <input
                type="radio"
                name="deliveryMethod"
                value="Standard"
                onChange={() => setDeliveryMethod('Standard')}
                required
              />
              Transport până la ușă - Standard
              <p>Această metodă de livrare poate aduce costuri suplimentare</p>
            </label>
            <label>
              <input
                type="radio"
                name="deliveryMethod"
                value="Premium"
                onChange={() => setDeliveryMethod('Premium')}
                required
              />
              Livrare și Montaj - Premium
              <p>Această metodă de livrare poate aduce costuri suplimentare</p>
            </label>
            <label>
              <input
                type="radio"
                name="deliveryMethod"
                value="Magazin"
                onChange={() => setDeliveryMethod('Magazin')}
                required
              />
              Ridicare din magazin
            </label>
          </div>
          <div className="checkout-paymentMethod">
          <h3>Metoda de plată</h3>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={() => setPaymentMethod('PayPal')}
                required
              />
              <img src="https://www.paypalobjects.com/webstatic/i/logo/rebrand/ppcom.svg" alt="PayPal" />
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Ramburs"
                onChange={() => setPaymentMethod('Ramburs')}
                required
              />
              Ramburs (plata la livrare)
            </label>
            <h3>Cod promoțional</h3>
            <div className="checkout-promobox">
              <input
                type="text"
                name="promoCode"
                placeholder="Introduceți codul promoțional"
                value={promoCode}
                onChange={handlePromoCodeChange}
              />
              <button type="button" onClick={applyPromoCode}>Aplică codul</button>
            </div>
          </div>
        </form>
      </div>

      <div className="checkout-right">
        <h2>Produse în coș</h2>
        {Object.keys(cartItems).map((itemId) => {
          const product = all_product.find((product) => product.id === parseInt(itemId));
          if (cartItems[itemId] > 0 && product) {
            return (
              <div key={itemId} className="checkout-product">
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <div className="quantity-controls">
                    <button onClick={() => updateCartItemQuantity(itemId, cartItems[itemId] - 1)}>-</button>
                    <span>{cartItems[itemId]}</span>
                    <button onClick={() => updateCartItemQuantity(itemId, cartItems[itemId] + 1)}>+</button>
                  </div>
                  <p>Preț: {product.new_price_with_tva} RON</p>
                </div>
              </div>
            );
          }
          return null;
        })}
        <div className="checkout-total">
          <p>Subtotal: {getSubtotal().toFixed(2)} RON</p>
          <p>Cost livrare: {getShippingCost().toFixed(2)} RON</p>
          <p>Reducere: -{discountValue.toFixed(2)} RON</p>
          <h3>Total: {getTotal(getSubtotal(), getShippingCost(), discount).toFixed(2)} RON</h3>
        </div>
        <div className="section">
        {paymentMethod === 'PayPal' ? (
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
          ) : (
            <button type="submit">Plasează comanda</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
