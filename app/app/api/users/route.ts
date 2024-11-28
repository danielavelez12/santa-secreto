import { clerkClient } from "@clerk/nextjs/server";
import { createCipheriv } from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await clerkClient();
    const users = await response.users.getUserList({
      limit: 100,
    });
    console.log(users);

    // Use an encryption key (in production, this should be in environment variables)
    const encryptionKey = "santa-secreto-con-los-garcias!!!"; // Must be 32 chars for AES-256
    const iv = Buffer.from("1234567890123456"); // 16 bytes fixed IV

    // Encrypt usernames and create assignment pairs
    const encryptedUsers = users.data.map((user) => {
      const cipher = createCipheriv("aes-256-cbc", encryptionKey, iv);
      let encrypted = cipher.update(user.username || "", "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        id: user.id,
        originalUsername: user.username,
        encryptedUsername: encrypted,
        iv: iv.toString("hex"), // Save IV for decryption
      };
    });

    // Sort by encrypted username
    encryptedUsers.sort((a, b) =>
      a.encryptedUsername.localeCompare(b.encryptedUsername)
    );

    // Assign each user to the next person in the sorted list
    const assignments = encryptedUsers.map((user, index) => ({
      userId: user.id,
      username: user.originalUsername,
      recipientEncryptedUsername:
        encryptedUsers[(index + 1) % encryptedUsers.length].encryptedUsername,
      iv: encryptedUsers[(index + 1) % encryptedUsers.length].iv, // Add IV to assignments
    }));

    console.log(assignments);

    return NextResponse.json({ assignments, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
