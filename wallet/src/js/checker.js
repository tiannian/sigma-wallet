export const createUrlValidator =
  (message = 'Invalid URL format') =>
  url => {
    try {
      const urlObj = new URL(url);
      return {
        isValid: urlObj.protocol === 'http:' || urlObj.protocol === 'https:',
        message,
      };
    } catch {
      return {
        isValid: false,
        message,
      };
    }
  };
