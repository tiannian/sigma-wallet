/**
 * 从URL获取并保存所有 provider 配置到 localStorage
 * Fetch and save all provider configurations from URL to localStorage
 * @param {string} url - Provider configuration URL
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const saveProviderConfig = async url => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let config = await response.json();

  config.providerRPC = url;

  return config;
};
