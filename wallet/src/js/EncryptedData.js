const ENCRYPTED_DATA_KEY = 'encrypted_data';
const ENCRYPTING_DATA_KEY = 'encrypting_data';

export default class EncryptedData {
  constructor() {
    const data = localStorage.getItem(ENCRYPTED_DATA_KEY);
    const encryptingData = localStorage.getItem(ENCRYPTING_DATA_KEY);

    this.encryptedData = JSON.parse(data);
    this.encryptingData = JSON.parse(encryptingData);
  }

  isInitialized() {
    const result = this.encryptedData !== null;

    console.log('encryptedData Initialized?', result);
    return result;
  }

  init() {
    if (this.isInitialized()) {
      return;
    }

    const aKey = new Uint8Array(32);
    window.crypto.getRandomValues(aKey);

    const eKey = new Uint8Array(32);
    window.crypto.getRandomValues(eKey);

    this.encryptingData = {
      encryptedAKey: null,
      aKey,
      encryptedEKey: null,
      eKey,
      publicInfo: {},
      privateInfo: {},
    };
  }

  save() {
    localStorage.setItem(ENCRYPTED_DATA_KEY, JSON.stringify(this.encryptedData));
    localStorage.setItem(ENCRYPTING_DATA_KEY, JSON.stringify(this.encryptingData));
  }

  async encrypt(key) {
    const textEncoder = new TextEncoder();

    this.encryptingData.encryptedAKey = await encryptData(
      textEncoder.encode(this.encryptingData.aKey),
      key
    );
    this.encryptingData.encryptedEKey = await encryptData(
      textEncoder.encode(this.encryptingData.eKey),
      key
    );
  }

  completeInit() {
    this.encryptedData = this.encryptingData;
    this.encryptedData.eKey = null;
    this.encryptingData = null;
    localStorage.setItem(ENCRYPTED_DATA_KEY, JSON.stringify(this.encryptedData));
    localStorage.removeItem(ENCRYPTING_DATA_KEY);
  }
}

const encryptData = async (data, key) => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
  const hashArray = new Uint8Array(hashBuffer);

  const encryptKey = await crypto.subtle.importKey('raw', hashArray, { name: 'AES-GCM' }, true, [
    'encrypt',
    'decrypt',
  ]);

  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    encryptKey,
    data
  );

  return {
    encryptedData: new Uint8Array(encryptedData),
    iv,
  };
};

const base64ToUint8Array = base64 => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const uint8ArrayToBase64 = uint8Array => {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};
