
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [processingAdd, setProcessingAdd] = useState(false);

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

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
    setProcessingAdd(false);
    setProductName('');
    setProductCategory('');
    setProductPrice('');
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowEditProductModal(true);
  };

  const handleCloseEditProductModal = () => {
    setShowEditProductModal(false);
    setEditProduct(null);
  };

  const handleSubmitAddProduct = async (e) => {
    e.preventDefault();
    setProcessingAdd(true);

    try {
      await db.collection('products').add({
        productName,
        productCategory,
        productPrice: parseFloat(productPrice),
      });

      setProductName('');
      setProductCategory('');
      setProductPrice('');
      setShowAddProductModal(false);
      setProcessingAdd(false);

      // Notify product added
      toast.success('Product added successfully!', { position: 'top-right' });
    } catch (error) {
      console.error('Error adding product:', error);

      // Notify error
      toast.error('Error adding product. Please try again later.', {
        position: 'top-right',
      });
    }
  };

  const handleSaveEditProduct = async () => {
    if (editProduct) {
      const { id, ...updatedProduct } = editProduct;

      try {
        await db.collection('products').doc(id).update(updatedProduct);

        setEditProduct(null);
        setShowEditProductModal(false);

        // Notify product edited
        toast.success('Product edited successfully!', { position: 'top-right' });
      } catch (error) {
        console.error('Error editing product:', error);

        // Notify error
        toast.error('Error editing product. Please try again later.', {
          position: 'top-right',
        });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await db.collection('products').doc(id).delete();

      // Notify product deleted
      toast.error('Product deleted!', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting product:', error);

      // Notify error
      toast.error('Error deleting product. Please try again later.', {
        position: 'top-right',
      });
    }
  };


  const modalStyles = {
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      width: '90%',
      backgroundColor: 'white',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      borderRadius: '5px',
      zIndex: '1000',
      transition: 'opacity 0.3s ease',
      opacity: showAddProductModal || showEditProductModal ? 1 : 0,
      pointerEvents: showAddProductModal || showEditProductModal ? 'auto' : 'none',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'white',
    },
    backArrow: {
      fontSize: '1.5rem',
      color: '#000000',
    },
    heading: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    addButton: {
      margin: '15px',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.3s ease',
    },
    addButtonHover: {
      backgroundColor: '#0056b3',
    },
    modalHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '15px',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: '1.25rem',
    },
    modalBody: {
      padding: '15px',
    },
    modalFooter: {
      borderTop: '1px solid #ddd',
      padding: '15px',
      textAlign: 'right',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
    },
    inputLabel: {
      fontSize: '1rem',
      marginBottom: '8px',
    },
    inputBox: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      marginBottom: '15px',
    },
    selectBox: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      marginBottom: '15px',
      backgroundColor: 'white',
    },
  };
  
  const cardStyles = {
    card: {
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    cardButtons: {
      display: 'flex',
      alignItems: 'center',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      marginRight: '5px',
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '3px',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '3px',
    },
  };
  
 

  return (
    <div>
 
        <Link to="/"><FontAwesomeIcon icon={faArrowLeft} style={{color: "#000000",}} /></Link>
      <h2>Products</h2>
      <button className="add-button" onClick={handleAddProduct}>
        Add Product
      </button>

      {/* Add Product Modal */}
      <div style={modalStyles.modal}>
        <div style={modalStyles.modalHeader}>
          <h3 style={modalStyles.modalTitle}>Add Product</h3>
        </div>
        <div style={modalStyles.modalBody}>
          <form onSubmit={handleSubmitAddProduct}>
            <div>
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div>
  <label htmlFor="productCategory">Product Category</label>
  <select
    id="productCategory"
    value={productCategory}
    onChange={(e) => setProductCategory(e.target.value)}
    required
  >
    <option value="">Select a category</option>
    <option value="tea">Tea</option>
    <option value="milkshakes">Milkshakes</option>
    <option value="coolers">Coolers</option>
    <option value="pri-milkshake">Pri-Milkshake</option>
  </select>
</div>
            <div>
              <label htmlFor="productPrice">Product Price</label>
              <input
                type="number"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="save-button">
              Add Product
            </button>
            <button
              onClick={handleCloseAddProductModal}
              className="cancel-button"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div style={modalStyles.modal}>
          <div style={modalStyles.modalHeader}>
            <h3 style={modalStyles.modalTitle}>Edit Product</h3>
          </div>
          <div style={modalStyles.modalBody}>
            <form>
              <div>
                <label htmlFor="editProductName">Product Name</label>
                <input
                  type="text"
                  id="editProductName"
                  value={editProduct ? editProduct.productName : ''}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
              <label htmlFor="editProductCategory">Product Category</label>
<select
  id="editProductCategory"
  value={editProduct ? editProduct.productCategory : ''}
  onChange={(e) =>
    setEditProduct({
      ...editProduct,
      productCategory: e.target.value,
    })
  }
>
  <option value="">Select a category</option>
  <option value="tea">Tea</option>
  <option value="milkshakes">Milkshakes</option>
  <option value="coolers">Coolers</option>
  <option value="pri-milkshake">Pri-Milkshake</option>
</select>

              </div>
              <div>
                <label htmlFor="editProductPrice">Product Price</label>
                <input
                  type="number"
                  id="editProductPrice"
                  value={editProduct ? editProduct.productPrice : ''}
                  placeholder=''
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      productPrice: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </form>
          </div>
          <div style={modalStyles.modalFooter}>
            <button
              onClick={handleCloseEditProductModal}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditProduct}
              className="save-button"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="product-list">
        {products.map((product) => (
          <div
            className="product-card"
            style={cardStyles.card}
            key={product.id}
          >
            <span className="product-name">{product.productName}</span>
            <span className="product-category">
              {product.productCategory}
            </span>
            <span className="product-price">
              ${product.productPrice.toFixed(2)}
            </span>
            <div className="card-buttons" style={cardStyles.cardButtons}>
              <button
                className="edit-button"
                onClick={() => handleEditProduct(product)}
                style={cardStyles.editButton}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(product.id)}
                style={cardStyles.deleteButton}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default ProductsPage;
