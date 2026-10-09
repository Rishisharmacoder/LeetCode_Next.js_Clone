const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

test("User model should use clerkId, not clearkId", () => {
  const schema = fs.readFileSync(
    path.join(__dirname, "..", "prisma", "schema.prisma"),
    "utf8",
  );

  assert.match(schema, /model\s+User\s*\{[\s\S]*?clerkId\s+String\s+@unique/);
});
