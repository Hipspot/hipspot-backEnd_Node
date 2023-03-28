import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export const cryptoUTFToBase64 = async (iv: Buffer, textToEncrypt: string) => {
  const key = await getSaltKey();
  const cipher = createCipheriv('aes-256-ctr', key, iv);
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);

  return encryptedText.toString('hex');
};

export const decryptoBase64ToUTF = async (
  ivString: string,
  textToDecrypt: string,
) => {
  const key = await getSaltKey();
  const decipher = createDecipheriv(
    'aes-256-ctr',
    key,
    Buffer.from(ivString, 'hex'),
  );
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(textToDecrypt, 'hex')),
    decipher.final(),
  ]);
  return decryptedText.toString('utf-8');
};

export const getRandomIv = () => randomBytes(16);
export const getSaltKey = async () => {
  return (await promisify(scrypt)(
    process.env.REFRESH_CIPHER_KEY,
    'salt',
    32,
  )) as Buffer;
};
