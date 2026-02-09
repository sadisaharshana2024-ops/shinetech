/**
 * SHINE TECH Security Utilities
 * Provides layers for data protection and input safety.
 */

// Simple obfuscation for demonstration (In production, use AES-256 via CryptoJS)
export const encryptData = (data) => {
    try {
        const stringData = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(stringData)));
    } catch (e) {
        console.error('Security Error: Encryption failed', e);
        return null;
    }
};

export const decryptData = (encryptedData) => {
    try {
        if (!encryptedData) return null;
        const decoded = decodeURIComponent(escape(atob(encryptedData)));
        return JSON.parse(decoded);
    } catch (e) {
        console.warn('Security Notice: Storage was cleared or data is invalid.');
        return null;
    }
};

/**
 * Sanitizes input to prevent XSS attacks.
 * Strips out potentially dangerous HTML tags and event handlers.
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Basic sanitization: replace < and > to prevent tag execution
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/javascript:/gi, "") // Prevent script execution in attributes
        .replace(/on\w+=/gi, "");     // Prevent event handler injection
};

/**
 * Validates URLs for security (only allows known protocols).
 */
export const validateUrl = (url) => {
    if (!url) return true;
    if (url.startsWith('data:image/')) return true; // Allow Base64 images
    try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch (e) {
        return false;
    }
};
