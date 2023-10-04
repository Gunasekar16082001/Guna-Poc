// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';

// const BillsStore = () => {
//   const [billDates, setBillDates] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [billsForSelectedDate, setBillsForSelectedDate] = useState([]);

//   // Fetch unique bill dates from Firestore
//   useEffect(() => {
//     const unsubscribe = db.collectionGroup('storebills')
//       .orderBy('timestamp', 'desc')
//       .onSnapshot((snapshot) => {
//         const uniqueDates = new Set();
//         snapshot.forEach((doc) => {
//           const timestamp = doc.data().timestamp.toDate();
//           const dateKey = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
//           uniqueDates.add(dateKey);
//         });
//         setBillDates(Array.from(uniqueDates).sort().reverse());
//       });

//     return () => unsubscribe();
//   }, []);

//   // Fetch bills for the selected date
//   useEffect(() => {
//     if (selectedDate) {
//       db.collection('storebills')
//         .doc(selectedDate)
//         .collection('bill-collections')
//         .orderBy('timestamp', 'desc')
//         .onSnapshot((snapshot) => {
//           const billData = [];
//           snapshot.forEach((doc) => {
//             billData.push({ id: doc.id, ...doc.data() });
//           });
//           setBillsForSelectedDate(billData);
//         });
//     } else {
//       setBillsForSelectedDate([]);
//     }
//   }, [selectedDate]);

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div>
//       <h2>Bills store</h2>
//       <div>
//         {billDates.map((date) => (
//           <div key={date}>
//             <h3 onClick={() => handleDateSelect(date)} style={{ cursor: 'pointer' }}>{date}</h3>
//             {selectedDate === date && (
//               <div>
//                 {billsForSelectedDate.map((bill, index) => (
//                   <div key={bill.id}>
//                     <h4>Bill Number {index + 1}:</h4>
//                     <strong>Date & Time:</strong> {bill.timestamp.toDate().toLocaleString()} <br />
//                     <strong>Total:</strong> {bill.total.toFixed(2)}
//                     <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
//                       {bill.products.map((product, productIndex) => (
//                         <li key={productIndex}>
//                           {product.productName} x {product.quantity} - {(product.quantity * product.productPrice).toFixed(2)}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BillsStore;
