import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMenu() {
  // Create menu categories
  const categories = ['Kota', 'Burgers', 'Sandwiches', 'Meals', 'Extras', 'Drinks'];

  const createdCategories: Record<string, string> = {};

  for (const name of categories) {
    const cat = await prisma.menuCategory.upsert({
      where: { id: name }, // will fail, so use create approach
      update: {},
      create: { name },
    }).catch(async () => {
      // If upsert fails, try findFirst or create
      const existing = await prisma.menuCategory.findFirst({ where: { name } });
      if (existing) return existing;
      return prisma.menuCategory.create({ data: { name } });
    });
    createdCategories[name] = cat.id;
  }

  console.log('Categories created:', Object.keys(createdCategories));

  // Menu items
  const menuItems = [
    { name: 'Classic Kota', category: 'Kota', price: 45.99, costPerUnit: 25.00, description: 'Bread roll with polony, chips, and sauce' },
    { name: 'Cheese Kota', category: 'Kota', price: 55.99, costPerUnit: 30.00, description: 'Classic kota with extra cheese' },
    { name: 'Russian Kota', category: 'Kota', price: 59.99, costPerUnit: 32.00, description: 'Kota with russian sausage, chips, and egg' },
    { name: 'Skhambane', category: 'Kota', price: 75.99, costPerUnit: 40.00, description: 'Fully loaded kota with all meats' },
    { name: 'Cheese Burger', category: 'Burgers', price: 65.99, costPerUnit: 35.00, description: 'Beef patty with cheese, lettuce, and tomato' },
    { name: 'Chicken Burger', category: 'Burgers', price: 59.99, costPerUnit: 30.00, description: 'Crispy chicken patty with mayo' },
    { name: 'Double Burger', category: 'Burgers', price: 85.99, costPerUnit: 50.00, description: 'Two beef patties with all the toppings' },
    { name: 'Dagwood Sandwich', category: 'Sandwiches', price: 49.99, costPerUnit: 25.00, description: 'Triple-decker sandwich with meats and veggies' },
    { name: 'Cheese Burger Meal', category: 'Meals', price: 89.99, costPerUnit: 45.00, description: 'Cheese burger with chips and a drink' },
    { name: 'Chicken Meal', category: 'Meals', price: 79.99, costPerUnit: 40.00, description: 'Chicken burger with chips and a drink' },
    { name: 'French Fries', category: 'Extras', price: 25.00, costPerUnit: 10.00, description: 'Crispy golden fries' },
    { name: 'Onion Rings', category: 'Extras', price: 30.00, costPerUnit: 12.00, description: 'Battered onion rings' },
    { name: 'Coca Cola 330ml', category: 'Drinks', price: 18.00, costPerUnit: 8.00, description: null },
    { name: 'Fanta Orange 330ml', category: 'Drinks', price: 18.00, costPerUnit: 8.00, description: null },
    { name: 'Water 500ml', category: 'Drinks', price: 12.00, costPerUnit: 5.00, description: null },
  ];

  for (const item of menuItems) {
    const categoryId = createdCategories[item.category];
    if (!categoryId) continue;

    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          costPerUnit: item.costPerUnit,
          categoryId,
          isAvailable: true,
        },
      });
    }
  }

  console.log(`Menu items seeded: ${menuItems.length} items`);
}

seedMenu()
  .catch((e) => {
    console.error('Error seeding menu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
