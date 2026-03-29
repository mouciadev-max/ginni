const { z } = require('zod');
console.log('📡 Zod imported successfully');
const schema = z.object({ name: z.string() });
console.log('📡 Zod schema created');
schema.parse({ name: 'test' });
console.log('✅ Zod parsed successfully!');
process.exit(0);
