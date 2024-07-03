import React, { useState, useEffect, useContext } from 'react';
import './CSS/Checkout.css';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';

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
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  });

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:4000/addresses', {
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

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
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
      const response = await fetch('http://localhost:4000/checkpromocode', {
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
      paymentMethod,
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
      const response = await fetch('http://localhost:4000/placeorder', {
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

  const getSubtotal = () => {
    return Object.keys(cartItems).reduce((sum, itemId) => {
      const product = all_product.find((product) => product.id === parseInt(itemId));
      if (cartItems[itemId] > 0 && product) {
        return sum + cartItems[itemId] * product.new_price_with_tva;
      }
      return sum;
    }, 0);
  };

  const getShippingCost = () => {
    switch (deliveryMethod) {
      case 'Premium':
        return 300;
      case 'Standard':
        return 100;
      case 'Magazin':
        return 0;
      default:
        return 0;
    }
  };

  const getDiscountAmount = (subtotal, discount) => (subtotal * discount) / 100;
  const getTotal = (subtotal, shippingCost, discount) => subtotal + shippingCost - getDiscountAmount(subtotal, discount);

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const total = getTotal(subtotal, shippingCost, discount);

  return (
    <div className="checkout">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <select className='address-select' onChange={handleSelectAddress}>
            <option value="">Alege o adresă</option>
            {userAddresses.map((address, index) => (
            <option key={index} value={index}>
              {address.firstName} {address.lastName} - {address.address}, {address.city}
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
                value="Card"
                onChange={() => setPaymentMethod('Card')}
                required
              />
              Card de debit sau credit
            </label>
            {paymentMethod === 'Card' && (
              <div>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Numărul cardului"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  required
                />
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="LL/AA"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  required
                />
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Titularul cardului"
                  value={cardDetails.cardHolder}
                  onChange={handleCardChange}
                  required
                />
              </div>
            )}
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
          </div>
          <button className='checkout-plasare' type="submit">Plasează comanda</button>
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
        <div className="checkout-total">
          <p>Subtotal: {subtotal.toFixed(2)} RON</p>
          <p>Cost livrare: {shippingCost.toFixed(2)} RON</p>
          <p>Reducere: -{discountValue.toFixed(2)} RON</p>
          <h3>Total: {total.toFixed(2)} RON</h3>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
