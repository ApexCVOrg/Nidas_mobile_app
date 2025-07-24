import axios from 'axios';

export const sendOtpEmail = async (to: string, otp: string) => {
  const subject = 'Mã xác thực OTP của bạn';
  const html = `<p>Mã OTP của bạn là: <b>${otp}</b></p>`;
  await axios.post('http://192.168.100.138:3001/send-email', {
    to,
    subject,
    html,
    type: 'otp'
  });
}; 