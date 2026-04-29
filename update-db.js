const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateUserRoles() {
  try {
    console.log("Starting database update...");
    
    // Update all users with role 'member' to 'user'
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "User" SET role = 'user' WHERE role = 'member'`
    );
    
    console.log(`✓ Updated ${result} records`);
    
    // Verify the update
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    
    console.log(`Total users in database: ${users.length}`);
    users.forEach(u => console.log(`  - ${u.email}: ${u.role}`));
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoles();
