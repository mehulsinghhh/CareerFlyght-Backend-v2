import prisma from "../config/prisma";
import { UserRole } from "@prisma/client";

async function promoteToAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: UserRole.admin },
    });
    console.log(`User ${email} promoted to admin successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.error("Please provide an email: npx ts-node src/scripts/promote-admin.ts <email>");
  process.exit(1);
}

promoteToAdmin(email);
