import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faIndianRupeeSign} from '@fortawesome/free-solid-svg-icons';

const ProductList = ({ addProductToCalculator }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('products').onSnapshot((snapshot) => {
      const productData = [];
      snapshot.forEach((doc) => {
        productData.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productData);
    });

    return () => unsubscribe();
  }, []);

  const productListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridGap: '10px',
    padding: '10px',
  };

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
  };
  return (
    <div style={productListStyle}>
    
     
        {products.map((product) => (
         <div
         key={product.id}
         style={cardStyle}
         onClick={() => addProductToCalculator(product)}
       >
            <div>{product.productName}</div> <FontAwesomeIcon icon={faIndianRupeeSign} style={{color: "#000000",}} /> {product.productPrice}
          </div>
        ))}
    
    </div>
  );
};

export default ProductList;
