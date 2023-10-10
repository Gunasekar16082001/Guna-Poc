import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const BillStore = () => {
  const [storeBills, setStoreBills] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [totalForSelectedDate, setTotalForSelectedDate] = useState(0);
  const [error, setError] = useState(null);

  // Fetch available years, months, and days
  useEffect(() => {
    const unsubscribe = db
      .collectionGroup('bill-collections') // Query all subcollections named 'bill-collections'
      .get()
      .then((querySnapshot) => {
        const yearsSet = new Set();
        const monthsSet = new Set();
        const daysSet = new Set();

        querySnapshot.forEach((doc) => {
          const timestamp = doc.get('timestamp').toDate();
          yearsSet.add(timestamp.getFullYear().toString());
          monthsSet.add((timestamp.getMonth() + 1).toString().padStart(2, '0'));
          daysSet.add(timestamp.getDate().toString().padStart(2, '0'));
        });

        setAvailableYears(Array.from(yearsSet));
        setAvailableMonths(Array.from(monthsSet));
        setAvailableDays(Array.from(daysSet));
      })
      .catch((error) => {
        console.error('Error fetching available dates:', error);
      });

    return () => unsubscribe();
  }, []);

  const handleYearSelect = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('');
    setSelectedDay('');
  };

  const handleMonthSelect = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDay('');
  };

  const handleDaySelect = (event) => {
    setSelectedDay(event.target.value);
  };

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const unsubscribe = db
        .collection('storebills')
        .doc(selectedYear)
        .collection(selectedMonth)
        .doc(selectedDay)
        .collection('bill-collections')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          const billsData = [];
          let total = 0;

          snapshot.forEach((doc) => {
            const billData = { id: doc.id, ...doc.data() };
            billsData.push(billData);
            total += billData.total;
          });

          if (billsData.length === 0) {
            setError("No bills available for the selected date.");
          } else {
            setError(null);
          }

          setStoreBills(billsData);
          setTotalForSelectedDate(total);
        });

      return () => unsubscribe();
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  return (
    <div>
      <h2>Store Bills</h2>
      <div>
        <label>Select Year:</label>
        <select onChange={handleYearSelect} value={selectedYear}>
          <option value="">Select Year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Month:</label>
        <select onChange={handleMonthSelect} value={selectedMonth}>
          <option value="">Select Month</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Day:</label>
        <select onChange={handleDaySelect} value={selectedDay}>
          <option value="">Select Day</option>
          {availableDays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <strong>Total for Selected Date:</strong> ${totalForSelectedDate.toFixed(2)}
      </div>
      {storeBills.map((bill, index) => (
        <div key={bill.id}>
          <h3>Bill Number {index + 1}:</h3>
          <strong>Date & Time:</strong> {bill.timestamp.toDate().toLocaleString()} <br />
          <strong>Total:</strong> ${bill.total.toFixed(2)}
          <ul>
            {bill.products.map((product, productIndex) => (
              <li key={productIndex}>
                {product.productName} x {product.quantity} - ${(product.quantity * product.productPrice).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BillStore;
