import Aes from 'react-native-aes-crypto';

const generateKey = (password: string, salt: string, cost: number, length: number) =>
  Aes.pbkdf2(password, salt, cost, length, 'sha256');

export const encryptData = async (text: string, keyIdentifier: string) => {
  const key = await generateKey(keyIdentifier, 'salt', 5000, 256);
  const iv = await Aes.randomKey(16);
  const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
  return {
    cipher,
    iv,
  };
};

export const decryptData = async (
  encryptedData: { cipher: string; iv: string },
  keyIdentifier: string
) => {
  const key = await generateKey(keyIdentifier, 'salt', 5000, 256);
  const decryptedData = await Aes.decrypt(
    encryptedData.cipher,
    key,
    encryptedData.iv,
    'aes-256-cbc'
  );
  return decryptedData;
};
