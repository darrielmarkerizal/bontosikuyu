import { getDatabase } from "./database";
import { DataTypes, Model } from "sequelize";

// Define User model interface for TypeScript
export interface UserAttributes {
  id?: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

// Define Article model interface
export interface ArticleAttributes {
  id?: number;
  articleCategoryId: number;
  writerId: number;
  status: "draft" | "publish";
  content: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ArticleInstance
  extends Model<ArticleAttributes>,
    ArticleAttributes {}

// Add Log model interface
export interface LogAttributes {
  id?: number;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "VIEW"
    | "DOWNLOAD"
    | "UPLOAD";
  tableName?: string;
  recordId?: number;
  userId?: number;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Log extends Model<LogAttributes> implements LogAttributes {
  public id!: number;
  public action!:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "VIEW"
    | "DOWNLOAD"
    | "UPLOAD";
  public tableName?: string;
  public recordId?: number;
  public userId?: number;
  public oldValues?: string;
  public newValues?: string;
  public ipAddress?: string;
  public userAgent?: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Model definitions
export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class Article
  extends Model<ArticleAttributes>
  implements ArticleAttributes
{
  public id!: number;
  public articleCategoryId!: number;
  public writerId!: number;
  public status!: "draft" | "publish";
  public content!: string;
  public imageUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize models
let modelsInitialized = false;

export async function initializeModels() {
  if (modelsInitialized) return { User, Article, Log };

  const sequelize = await getDatabase();

  // Initialize User model
  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  // Initialize Article model
  Article.init(
    {
      articleCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      writerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
      status: {
        type: DataTypes.ENUM("draft", "publish"),
        allowNull: false,
        defaultValue: "draft",
        validate: {
          isIn: [["draft", "publish"]],
        },
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 50000], // Minimum 10, maximum 50000 characters
        },
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Article",
      tableName: "Articles",
      timestamps: true,
    }
  );

  // Initialize Log model
  Log.init(
    {
      action: {
        type: DataTypes.ENUM(
          "CREATE",
          "UPDATE",
          "DELETE",
          "LOGIN",
          "LOGOUT",
          "VIEW",
          "DOWNLOAD",
          "UPLOAD"
        ),
        allowNull: false,
      },
      tableName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      recordId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      oldValues: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      newValues: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Log",
      tableName: "Logs",
      timestamps: true,
    }
  );

  modelsInitialized = true;
  return { User, Article, Log };
}

// Helper function to get models
export async function getModels() {
  return await initializeModels();
}
