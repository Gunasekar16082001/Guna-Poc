import React from 'react';
import { db } from '../firebase'; // Make sure to import your Firebase configuration

const Calculator = ({ selectedProducts, removeProductFromCalculator, setSelectedProducts }) => {
  const calculateTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + product.productPrice * product.quantity, 0).toFixed(2);
  };

  const updateQuantity = (product, action) => {
    const updatedProducts = selectedProducts.map((p) => {
      if (p.id === product.id) {
        if (action === 'increase') {
          p.quantity += 1;
        } else if (action === 'decrease' && p.quantity > 1) {
          p.quantity -= 1;
        }
      }
      return p;
    });
    setSelectedProducts(updatedProducts);
  };

  const removeAllProducts = () => {
    // Clear the selected products array to remove all items
    setSelectedProducts([]);
  };

  const storeProducts = () => {
    if (selectedProducts.length === 0) {
      // Show a warning if no items are selected
      alert('Please select at least one item before storing.');
      return;
    }

    // Store the selected products in Firebase Firestore
    db.collection('bills')
      .add({
        timestamp: new Date(),
        products: selectedProducts,
        total: parseFloat(calculateTotalPrice()),
      })
      .then((docRef) => {
        console.log('Bill saved with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding bill: ', error);
      });

    // Clear selected products immediately after triggering the store operation
    removeAllProducts();
  };

  const calculatorStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = {
    background: 'red',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={calculatorStyle}>
      <h2>Calculator</h2>
      <button onClick={removeAllProducts} style={buttonStyle}>
        Remove All
      </button>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.productName}</td>
              <td>
                <button onClick={() => updateQuantity(product, 'decrease')}>-</button>
                {product.quantity}
                <button onClick={() => updateQuantity(product, 'increase')}>+</button>
              </td>
              <td>{(product.quantity * product.productPrice).toFixed(2)}</td>
              <td>
                <button
                  style={buttonStyle}
                  onClick={() => removeProductFromCalculator(product.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={storeProducts} style={buttonStyle}>
          Store
        </button>
        <hr />
        <div>
          <h4>Billing details</h4>
          <strong>Total Price: ${calculateTotalPrice()}</strong>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
