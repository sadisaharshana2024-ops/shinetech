/**
 * Formats a numeric price into LKR (Rs.) format.
 * Example: 1250 -> Rs. 1,250.00
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'Rs.');
};
