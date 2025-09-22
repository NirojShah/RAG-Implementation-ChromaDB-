const z = require("zod");

const newChatSchema = z.object({
  chat_name: z.string().min(1, "Chat name is required"),
  user_id: z.string().min(1, "User ID is required"),
});

module.exports = {
  newChatSchema,
};
