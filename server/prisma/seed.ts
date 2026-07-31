import 'dotenv/config';

import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import { prisma } from '../src/config/database';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing data (in reverse dependency order)
  console.log('🧹 Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log('👤 Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const employees = [];
  for (let i = 1; i <= 2; i++) {
    employees.push(
      await prisma.user.create({
        data: {
          email: `employee${i}@demo.com`,
          passwordHash,
          firstName: `Employee`,
          lastName: `${i}`,
          role: 'EMPLOYEE',
        },
      }),
    );
  }
  const allUsers = [admin, ...employees];

  // 3. Create Categories
  console.log('📂 Creating categories...');
  const categoryNames = ['Electronics', 'Clothing', 'Food', 'Office', 'Other'];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: {
          name,
          description: `All ${name.toLowerCase()} items`,
        },
      }),
    ),
  );

  // 4. Create Suppliers
  console.log('🏭 Creating suppliers...');
  const suppliers = [];
  for (let i = 0; i < 10; i++) {
    suppliers.push(
      await prisma.supplier.create({
        data: {
          name: faker.company.name(),
          contactPerson: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: 'international' }),
          address: faker.location.streetAddress(),
          isActive: faker.datatype.boolean({ probability: 0.8 }), // 80% active
        },
      }),
    );
  }

  // 5. Create Products
  console.log('📦 Creating products...');
  const products = [];
  for (let i = 0; i < 50; i++) {
    const category = faker.helpers.arrayElement(categories);
    const supplier = faker.helpers.arrayElement(suppliers);

    // Mix of in-stock, low-stock, and out-of-stock
    const stockStatus = faker.helpers.arrayElement([
      'in_stock',
      'low_stock',
      'out_of_stock',
    ]);
    const reorderLevel = faker.number.int({ min: 10, max: 50 });
    let quantity = 0;

    if (stockStatus === 'in_stock') {
      quantity = faker.number.int({ min: reorderLevel + 10, max: 200 });
    } else if (stockStatus === 'low_stock') {
      quantity = faker.number.int({ min: 1, max: reorderLevel });
    }

    const costPrice = faker.number.float({
      min: 5,
      max: 500,
      fractionDigits: 2,
    });
    const unitPrice = costPrice * faker.number.float({ min: 1.2, max: 2.5 }); // 20% to 150% markup

    products.push(
      await prisma.product.create({
        data: {
          sku: `SKU-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          categoryId: category.id,
          supplierId: supplier.id,
          unitPrice,
          costPrice,
          quantity,
          reorderLevel,
          reorderQuantity: faker.number.int({ min: 20, max: 100 }),
          unit: faker.helpers.arrayElement(['pcs', 'box', 'kg']),
        },
      }),
    );
  }

  // 6. Create Purchases
  console.log('🛒 Creating purchases...');
  const purchases = [];
  for (let i = 0; i < 20; i++) {
    const supplier = faker.helpers.arrayElement(suppliers);
    const creator = faker.helpers.arrayElement(allUsers);
    const status = faker.helpers.arrayElement([
      'DRAFT',
      'ORDERED',
      'RECEIVED',
      'CANCELLED',
    ] as const);
    const createdAt = faker.date.recent({ days: 120 });

    const numItems = faker.number.int({ min: 1, max: 5 });
    const purchaseProducts = faker.helpers.arrayElements(products, numItems);

    let totalAmount = 0;
    const itemsData = purchaseProducts.map((product) => {
      const quantity = faker.number.int({ min: 10, max: 100 });
      // Prisma Decimal doesn't directly map from JS numbers in all situations, but passing JS number or string works.
      const unitCost = Number(product.costPrice);
      const subtotal = quantity * unitCost;
      totalAmount += subtotal;

      return {
        productId: product.id,
        quantity,
        unitCost,
        subtotal,
      };
    });

    purchases.push(
      await prisma.purchase.create({
        data: {
          purchaseNumber: `PO-${createdAt.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
          supplierId: supplier.id,
          createdById: creator.id,
          status,
          totalAmount,
          createdAt,
          orderedAt:
            status !== 'DRAFT'
              ? faker.date.between({ from: createdAt, to: new Date() })
              : null,
          receivedAt:
            status === 'RECEIVED' ? faker.date.recent({ days: 30 }) : null,
          items: {
            create: itemsData,
          },
        },
      }),
    );
  }

  // 7. Create Sales
  console.log('📈 Creating sales...');
  for (let i = 0; i < 30; i++) {
    const creator = faker.helpers.arrayElement(allUsers);
    const status = faker.helpers.arrayElement([
      'DRAFT',
      'COMPLETED',
      'CANCELLED',
    ] as const);
    const createdAt = faker.date.recent({ days: 90 }); // Last 90 days

    const numItems = faker.number.int({ min: 1, max: 8 });
    const saleProducts = faker.helpers.arrayElements(products, numItems);

    let totalAmount = 0;
    const itemsData = saleProducts.map((product) => {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const unitPrice = Number(product.unitPrice);
      const subtotal = quantity * unitPrice;
      totalAmount += subtotal;

      return {
        productId: product.id,
        quantity,
        unitPrice,
        subtotal,
      };
    });

    await prisma.sale.create({
      data: {
        saleNumber: `INV-${createdAt.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        createdById: creator.id,
        customerName: faker.person.fullName(),
        customerEmail: faker.internet.email(),
        status,
        totalAmount,
        createdAt,
        completedAt:
          status === 'COMPLETED'
            ? faker.date.between({ from: createdAt, to: new Date() })
            : null,
        items: {
          create: itemsData,
        },
      },
    });
  }

  // 8. Create Activity Logs
  console.log('📋 Creating activity logs...');
  const logsData = [];
  const entityTypes = ['Product', 'Sale', 'Purchase', 'Supplier', 'Category'];

  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(allUsers);
    const action = faker.helpers.arrayElement([
      'CREATE',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
    ] as const);

    logsData.push({
      userId: user.id,
      action,
      entityType: faker.helpers.arrayElement(entityTypes),
      entityId: faker.string.uuid(),
      createdAt: faker.date.recent({ days: 30 }),
      ipAddress: faker.internet.ipv4(),
    });
  }

  await prisma.activityLog.createMany({
    data: logsData,
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
