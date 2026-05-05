// utils/testData.js
const fs = require('fs');

// ---------- Helpers ----------
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(length) {
  let num = '';
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

function randomChar() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

// ---------- Name ----------
function generateName() {
  const firstNames = ['Sarika', 'Anita', 'Priya', 'Kavya', 'Neha'];
  const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Das'];
  return `${randomFromArray(firstNames)} ${randomFromArray(lastNames)}`;
}

// ---------- Email ----------
function generateEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
  const clean = name.toLowerCase().replace(/\s+/g, '');
  return `${clean}${randomNumber(4)}@${randomFromArray(domains)}`;
}

// ---------- Indian Mobile ----------
function generateIndianMobile() {
  return randomFromArray(['6', '7', '8', '9']) + randomNumber(9);
}

// ---------- Address ----------
function generateAddress() {
  const streets = ['Main Road', 'MG Road', 'Park Street', 'Temple Road'];
  const cities = ['KANNUR', 'KOZHIKODE', 'ERNAKULAM'];
  return `${Math.floor(Math.random() * 200) + 1}, ${randomFromArray(
    streets
  )}, ${randomFromArray(cities)}`;
}

// ---------- PAN ----------
function generatePAN() {
  return (
    randomChar() +
    randomChar() +
    randomChar() +
    randomChar() +
    randomChar() +
    randomNumber(4) +
    randomChar()
  );
}

// ---------- GST ----------
function generateGST(pan) {
  const stateCode = '32'; // Kerala
  const entityCode = randomNumber(1);
  const checksum = randomChar();
  return `${stateCode}${pan}${entityCode}Z${checksum}`;
}

// ---------- DOB (18+ years) ----------
function generateDOB(minAge = 18) {
  const today = new Date();
  const year = today.getFullYear() - minAge - Math.floor(Math.random() * 20);
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;

  return { day, month, year };
}

// ---------- Save data ----------
function saveTestData(data, file = 'test-output/vendorData.json') {
  if (!fs.existsSync('test-output')) {
    fs.mkdirSync('test-output');
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  generateName,
  generateEmail,
  generateIndianMobile,
  generateAddress,
  generatePAN,
  generateGST,
  generateDOB,
  saveTestData
};