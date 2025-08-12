import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("emp123", 10);

  const employees = [
    {
      employeeId: "EMP01",
      name: "PRAKASH KUMAR",
      department: "IT",
      designation: "MANGER",
    },
    {
      employeeId: "EMP02",
      name: "BHASKAR GUPTA",
      department: "HR",
      designation: "EXECUTIVE",
    },
    {
      employeeId: "EMP03",
      name: "HIMANSHU GUPTA",
      department: "FINANCE",
      designation: "FOUNDER",
    },
    {
      employeeId: "EMP04",
      name: "KRISH GUPTA",
      department: "MANAGER",
      designation: "CO-FOUNDER",
    },
    {
      employeeId: "EMP05",
      name: "BABU",
      department: "GUARD",
      designation: "TECH",
    },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { employeeId: emp.employeeId },
      update: {},
      create: {
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        designation: emp.designation,
        password: passwordHash,
        // email, phone left as null (optional in schema)
        // joinDate, status use defaults
      },
    });
  }

  console.log("✅ Seeded 5 employees successfully");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding employees:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
