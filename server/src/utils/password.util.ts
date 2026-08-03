import bcrypt from 'bcrypt';

// 12 rounds of salting is the OWASP-recommended minimum for production.
// Higher = more secure, but exponentially slower (12 rounds ≈ ~250ms on modern hardware).
// Never go below 10 rounds.
const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * Uses bcrypt with 12 salt rounds. Never store plain-text passwords.
 *
 * @param plaintext - The raw password from the user's registration form
 * @returns A bcrypt hash string safe to store in the database
 */
export const hashPassword = (plaintext: string): Promise<string> => {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
};

/**
 * Compare a plain-text password against a stored bcrypt hash.
 *
 * @param plaintext - The raw password from the user's login form
 * @param hash - The stored bcrypt hash from the database
 * @returns `true` if the password matches; `false` otherwise
 */
export const comparePassword = (
  plaintext: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plaintext, hash);
};
