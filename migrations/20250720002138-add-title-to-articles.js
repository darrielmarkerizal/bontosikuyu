"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Articles", "title", {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "Untitled Article", // Temporary default for existing records
    });

    // Update existing records to have proper titles
    await queryInterface.sequelize.query(`
      UPDATE Articles 
      SET title = CASE 
        WHEN LENGTH(content) > 100 THEN CONCAT(LEFT(content, 100), '...')
        ELSE content 
      END
      WHERE title = 'Untitled Article'
    `);

    // Now make the column not nullable without default
    await queryInterface.changeColumn("Articles", "title", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    // Add index for title column
    await queryInterface.addIndex("Articles", ["title"]);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Articles", "title");
  },
};
