import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash ,faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
    
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);

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
    // Clear input fields when the modal is closed
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
    // Clear input fields when the modal is closed
    setEditProduct(null);
  };

  const handleSubmitAddProduct = async (e) => {
    e.preventDefault();

    // Add the product data to Firestore
    await db.collection('products').add({
      productName,
      productCategory,
      productPrice: parseFloat(productPrice),
    });

    // Clear the input fields and close the modal
    setProductName('');
    setProductCategory('');
    setProductPrice('');
    setShowAddProductModal(false);
  };

  const handleSaveEditProduct = async () => {
    if (editProduct) {
      const { id, ...updatedProduct } = editProduct;

      await db.collection('products').doc(id).update(updatedProduct);

      // Clear the editProduct state and close the modal
      setEditProduct(null);
      setShowEditProductModal(false);
    }
  };

  const handleDelete = async (id) => {
    await db.collection('products').doc(id).delete();
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
    modalHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '15px',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
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
    </div>
  );
};

export default ProductsPage;
