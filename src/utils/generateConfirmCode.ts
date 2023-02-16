export function generateCode(length = 6) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const result = [];

  for (let i = length; i > 0; --i) result.push(chars[Math.floor(Math.random() * chars.length)]);

  result.splice(3, 0, '-');
  return result.join('');
}
