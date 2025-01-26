// scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function main() {
    const defaultEmail = process.env.DEFAULT_EMAIL || 'default@kota.com';
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'defaultpassword';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: defaultEmail },
    });

    if (!existingUser) {
        // Create the default user with provided fields
        await prisma.user.create({
            data: {
                email: defaultEmail,
                password: hashedPassword,
                firstName: 'User',
                lastName: 'Test',
                profileImage: 'https://avatars.githubusercontent.com/u/123639497?v=4',
            },
        });

        console.log(`Default user created with email: ${defaultEmail}`);
    } else {
        console.log(`User with email ${defaultEmail} already exists.`);
    }
}

main()
    .catch((e) => {
        console.error('Error seeding the database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
