"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const logs = Array.from({ length: 1000 }, (_, index) => {
      const userId =
        index % 3 === 0 ? null : Math.floor(Math.random() * 21) + 47; // Random userId from 47 to 67 or null
      const action = [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "VIEW",
        "DOWNLOAD",
        "UPLOAD",
      ][Math.floor(Math.random() * 8)];
      const tableNames = [
        "Users",
        "Posts",
        "Comments",
        "Products",
        "Orders",
        null,
      ];
      const tableName =
        tableNames[Math.floor(Math.random() * tableNames.length)];
      const recordId =
        tableName && action !== "LOGIN" && action !== "LOGOUT"
          ? Math.floor(Math.random() * 1000) + 1
          : null;
      const timestamp = new Date(
        Date.now() - Math.floor(Math.random() * 150 * 24 * 60 * 60 * 1000)
      ); // Last 5 months
      const ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const userAgent = `Mozilla/5.0 (${["Windows", "macOS", "Linux", "iOS", "Android"][Math.floor(Math.random() * 5)]} NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${["Chrome", "Firefox", "Safari", "Edge", "Opera"][Math.floor(Math.random() * 5)]}/120.0.0.0 Safari/537.36`;

      // Generate oldValues and newValues based on action and tableName
      let oldValues = null;
      let newValues = null;
      if (action === "UPDATE" && tableName) {
        if (tableName === "Users") {
          oldValues = JSON.stringify({
            fullName: "Old Name",
            email: `old${index}@example.com`,
          });
          newValues = JSON.stringify({
            fullName: "New Name",
            email: `new${index}@example.com`,
          });
        } else if (tableName === "Posts") {
          oldValues = JSON.stringify({
            title: "Old Post Title",
            content: "Old content",
          });
          newValues = JSON.stringify({
            title: "New Post Title",
            content: "New content",
          });
        } else if (tableName === "Comments") {
          oldValues = JSON.stringify({ comment: "Old comment text" });
          newValues = JSON.stringify({ comment: "New comment text" });
        } else if (tableName === "Products") {
          oldValues = JSON.stringify({ name: "Old Product", price: 100 });
          newValues = JSON.stringify({ name: "New Product", price: 150 });
        } else if (tableName === "Orders") {
          oldValues = JSON.stringify({ status: "pending" });
          newValues = JSON.stringify({ status: "completed" });
        }
      } else if (action === "CREATE" && tableName) {
        newValues = JSON.stringify(
          tableName === "Users"
            ? { fullName: "New User", email: `user${index}@example.com` }
            : tableName === "Posts"
              ? { title: "New Post", content: "New content" }
              : tableName === "Comments"
                ? { comment: "New comment" }
                : tableName === "Products"
                  ? { name: "New Product", price: 200 }
                  : { status: "new" }
        );
      } else if (action === "DELETE" && tableName) {
        oldValues = JSON.stringify(
          tableName === "Users"
            ? { fullName: "Deleted User", email: `deleted${index}@example.com` }
            : tableName === "Posts"
              ? { title: "Deleted Post", content: "Deleted content" }
              : tableName === "Comments"
                ? { comment: "Deleted comment" }
                : tableName === "Products"
                  ? { name: "Deleted Product", price: 300 }
                  : { status: "deleted" }
        );
      }

      // Generate description based on action
      const description =
        action === "LOGIN"
          ? `User ${userId || "anonymous"} logged in`
          : action === "LOGOUT"
            ? `User ${userId || "anonymous"} logged out`
            : action === "VIEW"
              ? `Viewed ${tableName || "page"} ${recordId || ""}`
              : action === "DOWNLOAD"
                ? `Downloaded file from ${tableName || "resource"} ${recordId || ""}`
                : action === "UPLOAD"
                  ? `Uploaded file to ${tableName || "resource"} ${recordId || ""}`
                  : `${action} on ${tableName || "unknown"} ${recordId || ""}`;

      return {
        action,
        tableName,
        recordId,
        userId,
        oldValues,
        newValues,
        ipAddress,
        userAgent,
        description,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    });

    await queryInterface.bulkInsert("Logs", logs, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Logs", null, {});
  },
};
