require('dotenv').config();
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');
const { Category } = require('./src/models/category.model');
const { Product } = require('./src/models/product.model');

const collections = [
  { name: 'Sarees', slug: 'sarees' },
  { name: 'Lehengas', slug: 'lehengas' },
  { name: 'Kurtas & Suits', slug: 'kurtis' },
  { name: "Girls' Ethnic Wear", slug: 'girls' },
  { name: 'Wedding Collection', slug: 'wedding' },
  { name: 'Festive Collection', slug: 'festive' },
];

const products = [
  { name: 'Red Silk Woven Paithani Saree', price: 999, originalPrice: 2791, image: '/images/hero1.png', category: 'sarees', description: 'Luxurious handwoven Paithani silk saree with intricate zari work. Perfect for weddings and festivities.' },
  { name: 'Maroon Velvet Bridal Lehenga', price: 4999, originalPrice: 9999, image: '/images/hero2.png', category: 'lehengas', description: 'Heavy maroon velvet lehenga with zardosi embroidery. The perfect bridal outfit.' },
  { name: 'Ivory Chanderi Silk Suit Set', price: 2199, originalPrice: 4153, image: '/images/hero3.png', category: 'kurtis', description: 'Premium Chanderi silk kurta paired with palazzos and a matching dupatta.' },
  { name: 'Red Bridal Kanjivaram Saree', price: 1499, originalPrice: 4996, image: '/images/cat-designer.png', category: 'wedding', description: 'Signature bridal Kanjivaram in deep red with heavy gold border. For the queen on her big day.' },
  { name: 'Emerald Green Silk Lehenga', price: 1899, originalPrice: 3500, image: '/images/cat-silk.png', category: 'lehengas', description: 'Rich green silk lehenga with traditional motifs. Timeless elegance for every occasion.' },
  { name: 'Cotton Floral Printed Kurta', price: 499, originalPrice: 1290, image: '/images/cat-essentials.png', category: 'kurtis', description: 'Comfortable cotton kurta with delicate floral print. Ideal for daily wear and casual outings.' },
  { name: 'Ready To Wear Pre-Draped Saree', price: 1599, originalPrice: 4782, image: '/images/cat-readytowear.png', category: 'sarees', description: 'Modern pre-draped saree for the contemporary woman. Easy to wear and effortlessly stylish.' },
  { name: 'Golden Embroidery Anarkali Suit', price: 1699, originalPrice: 4203, image: '/images/hero1.png', category: 'kurtis', description: 'Stunning golden embroidery on an elegant Anarkali silhouette. Perfect for festive celebrations.' },
  { name: 'Royal Blue Silk Woven Saree', price: 1099, originalPrice: 3676, image: '/images/cat-silk.png', category: 'sarees', description: 'Regal blue silk weave with intricate border. A must-have for your wardrobe.' },
  { name: 'Festive Red Chaniya Choli', price: 2490, originalPrice: 4490, image: '/images/cat-designer.png', category: 'festive', description: 'Vibrant chaniya choli set for Navratri and festivals. Comfortable and colourful.' },
  { name: 'Blush Pink Organza Lehenga', price: 2199, originalPrice: 6153, image: '/images/hero3.png', category: 'lehengas', description: 'Delicate organza with soft pink tones and embroidery. Light and elegant.' },
  { name: 'Amber Yellow Sharara Set', price: 799, originalPrice: 2209, image: '/images/cat-essentials.png', category: 'kurtis', description: 'Vibrant turmeric yellow sharara paired with a short kurta. Festive favourite for pujas and celebrations.' },
];

async function main() {
  await connectDB();
  console.log("Seeding categories...");
  for (const c of collections) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      { name: c.name, slug: c.slug },
      { upsert: true, new: true }
    );
  }

  const dbCategories = await Category.find();
  const categoryMap = {};
  dbCategories.forEach(c => categoryMap[c.slug] = c._id);

  console.log("Seeding products...");
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const catId = categoryMap[p.category];
    
    if (!catId) {
      console.warn(`Category ${p.category} not found for product ${p.name}`);
      continue;
    }

    await Product.findOneAndUpdate(
      { slug },
      {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        deliveryCharge: 0,
        stock: 50,
        categoryId: catId,
        images: [p.image],
      },
      { upsert: true, new: true }
    );
  }

  console.log("Seeding complete!");
}

main().catch(console.error).finally(async () => {
  await mongoose.connection.close();
});
