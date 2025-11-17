/**
 * Validates password according to requirements:
 * - Minimum 6 characters long
 * - At least one lowercase character
 * - At least one number or symbol
 * - No whitespace characters allowed
 * @param {string} password - Password to validate
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }

  if (/\s/.test(password)) {
    return { isValid: false, error: 'Password cannot contain whitespace characters' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase character' }
  }

  if (!/[\d\W]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number or symbol' }
  }

  return { isValid: true, error: null }
}
