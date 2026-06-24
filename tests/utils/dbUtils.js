import oracledb from 'oracledb';
import { dbConfig } from './dbConfig.js';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function getOtpFromDb(phone) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT OTP
       FROM vendor_otpverification
       WHERE PHONE_NUMBER = :phone
       ORDER BY CREATED_DT DESC
       FETCH FIRST 1 ROWS ONLY`,
      { phone }
    );

    console.log('OTP Query Result:', result.rows);

    return result.rows?.length ? result.rows[0].OTP : null;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}