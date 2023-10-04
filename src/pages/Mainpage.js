import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import Calculator from '../components/Calculater';
import { Link } from 'react-router-dom';

function Mainpage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsData, setProductsData] = useState([]); // Define productsData state

  // Fetch products data when the component mounts
  useEffect(() => {
    // Replace this with your actual data fetching logic
    // Example: Fetch products from an API
    fetch('https://api.example.com/products')
      .then((response) => response.json())
      .then((data) => {
        setProductsData(data); // Set productsData state with fetched data
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const addProductToCalculator = (product) => {
    // Check if the product is already in the calculator
    const existingProduct = selectedProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      // If it exists, update its quantity
      const updatedProducts = selectedProducts.map((p) => {
        if (p.id === product.id) {
          p.quantity += 1;
        }
        return p;
      });
      setSelectedProducts(updatedProducts);
    } else {
      // If it doesn't exist, add it with a quantity of 1
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProductFromCalculator = (productId) => {
    setSelectedProducts(selectedProducts.filter((product) => product.id !== productId));
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px',
    justifyContent: 'flex-start', // Start with horizontal layout
  };

  const bigGridStyle = {
    flex: '2', // Takes up 2/3 of the available space
    background: '#3498db',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box', // Include padding in width calculation
  };

  const smallGridStyle = {
    flex: '1',
    background: '#3498db',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <Link to="/products">Products</Link>
      <br />
      <Link to="/bill-history">bills</Link>   
        <br />
      <Link to="/bill-store">billstore</Link>
      <div style={containerStyle}>
        <div style={bigGridStyle}>
            <ProductList
              addProductToCalculator={addProductToCalculator}
            />
        </div>
        <div style={smallGridStyle}>
          <Calculator
            selectedProducts={selectedProducts}
            removeProductFromCalculator={removeProductFromCalculator}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
      </div>
    </div>
  );
}

export default Mainpage;   
