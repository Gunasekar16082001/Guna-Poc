import React from 'react';

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

  const calculatorStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const productStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
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
