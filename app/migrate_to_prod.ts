// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createClerkClient } = require("@clerk/backend");

const users = ["sebastian", "diana", "monica", "daniela"];

const clerkClient = createClerkClient({
  secretKey: "sk_live_FmPxk4urexDj0n1B5QYzuRY4TW9HbS4AjClqKx6S6J",
});

async function createUsers() {
  for (const username of users) {
    try {
      const response = await clerkClient.users.createUser({
        username: username,
        password: `${username}secreto`,
      });
      console.log(`Created user: ${username}`);
    } catch (error) {
      console.error(`Error creating user ${username}:`, error);
    }
  }
}

createUsers()
  .then(() => console.log("All users created successfully"))
  .catch((error) => console.error("Error in batch creation:", error));
