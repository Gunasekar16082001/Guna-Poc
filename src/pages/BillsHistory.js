import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const BillsHistory = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    db.collection('bills')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const billData = [];
        snapshot.forEach((doc) => {
          billData.push({ id: doc.id, ...doc.data() });
        });
        setBills(billData);
      });
  }, []);

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f5f5f5',
  };

  const handleRemoveBill = (billId) => {
    // Remove the bill from Firebase
    db.collection('bills')
      .doc(billId)
      .delete()
      .then(() => {
        // Remove the bill from the local state
        setBills((prevBills) => prevBills.filter((bill) => bill.id !== billId));
      })
      .catch((error) => {
        console.error('Error removing bill: ', error);
      });
  };

  const handleStoreBills = () => {
    // Get the current bills
    const currentBills = [...bills];

    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const fullDate = `${year}-${month}-${day}`;

    // Store the bills in Firestore under the current date
    const batch = db.batch();
    currentBills.forEach((bill) => {
      const billRef = db.collection('storebills').doc(year).collection(month).doc(day).collection('bill-collections').doc();
      batch.set(billRef, { ...bill, timestamp: new Date() });
    });

    // Commit the batch and remove the bills from Firestore
    batch
      .commit()
      .then(() => {
        // Clear the bill history after storing bills
        currentBills.forEach((bill) => {
          db.collection('bills').doc(bill.id).delete();
        });
        setBills([]);
      })
      .catch((error) => {
        console.error('Error storing bills and deleting bills: ', error);
      });
  };

  return (
    <div>
      <h2>Bill History</h2>
      <div>Overall Total: ${bills.reduce((total, bill) => total + bill.total, 0).toFixed(2)}</div>
      <button onClick={handleStoreBills}>Store Bills and Clear</button>
      {bills.map((bill, index) => (
        <div key={bill.id} style={cardStyle}>
          <h3>Bill Number {index + 1}:</h3>
          <button onClick={() => handleRemoveBill(bill.id)}>Remove</button>
          <strong>Date & Time:</strong> {bill.timestamp.toDate().toLocaleString()} <br />
          <strong>Total:</strong> {bill.total.toFixed(2)}
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {bill.products.map((product, productIndex) => (
              <li key={productIndex}>
                {product.productName} x {product.quantity} - {(product.quantity * product.productPrice).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BillsHistory;
