console.log('      8d-1. Importing Zod...');
const { z } = require('zod');
console.log('      8d-2. Zod imported');

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});
console.log('      8d-3. Register schema created');

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
console.log('      8d-4. Login schema created');

module.exports = {
  registerSchema,
  loginSchema,
};
