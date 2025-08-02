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

// ADD: Travel model interface
export interface TravelCategoryAttributes {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelAttributes {
  id?: number;
  name: string;
  dusun:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  image?: string;
  travelCategoryId: number;
  category?: TravelCategoryAttributes;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelCategoryInstance
  extends Model<TravelCategoryAttributes>,
    TravelCategoryAttributes {}

export interface TravelInstance
  extends Model<TravelAttributes>,
    TravelAttributes {}

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

// Add Analytics models interfaces
export interface AnalyticsSessionAttributes {
  id?: number;
  sessionId: string;
  userId?: number;
  ipAddress: string;
  userAgent?: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  referrer?: string;
  landingPage: string;
  isBot: boolean;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PageViewAttributes {
  id?: number;
  sessionId: string;
  userId?: number;
  page: string;
  title?: string;
  timeOnPage?: number;
  exitPage?: boolean;
  viewedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
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

// ADD: Travel models
export class TravelCategory
  extends Model<TravelCategoryAttributes>
  implements TravelCategoryAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class Travel
  extends Model<TravelAttributes>
  implements TravelAttributes
{
  public id!: number;
  public name!: string;
  public dusun!:
    | "Dusun Laiyolo"
    | "Dusun Pangkaje'ne"
    | "Dusun Timoro"
    | "Dusun Kilotepo";
  public image?: string;
  public travelCategoryId!: number;
  public category?: TravelCategoryAttributes;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Add Analytics model classes
export class AnalyticsSession
  extends Model<AnalyticsSessionAttributes>
  implements AnalyticsSessionAttributes
{
  public id!: number;
  public sessionId!: string;
  public userId?: number;
  public ipAddress!: string;
  public userAgent?: string;
  public deviceType!: "desktop" | "mobile" | "tablet" | "unknown";
  public browser?: string;
  public os?: string;
  public country?: string;
  public city?: string;
  public referrer?: string;
  public landingPage!: string;
  public isBot!: boolean;
  public startTime!: Date;
  public endTime?: Date;
  public duration?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class PageView
  extends Model<PageViewAttributes>
  implements PageViewAttributes
{
  public id!: number;
  public sessionId!: string;
  public userId?: number;
  public page!: string;
  public title?: string;
  public timeOnPage?: number;
  public exitPage?: boolean;
  public viewedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize models
let modelsInitialized = false;

export async function initializeModels() {
  if (modelsInitialized)
    return {
      User,
      Article,
      Log,
      TravelCategory,
      Travel,
      AnalyticsSession,
      PageView,
    };

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

  // ADD: Initialize TravelCategory model
  TravelCategory.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TravelCategory",
      tableName: "TravelCategories",
      timestamps: true,
    }
  );

  // ADD: Initialize Travel model
  Travel.init(
    {
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 200],
        },
      },
      dusun: {
        type: DataTypes.ENUM(
          "Dusun Laiyolo",
          "Dusun Pangkaje'ne",
          "Dusun Timoro",
          "Dusun Kilotepo"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "Dusun Laiyolo",
              "Dusun Pangkaje'ne",
              "Dusun Timoro",
              "Dusun Kilotepo",
            ],
          ],
        },
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      travelCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Travel",
      tableName: "Travels",
      timestamps: true,
    }
  );

  // Initialize AnalyticsSession model
  AnalyticsSession.init(
    {
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deviceType: {
        type: DataTypes.ENUM("desktop", "mobile", "tablet", "unknown"),
        allowNull: false,
        defaultValue: "unknown",
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      os: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      referrer: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      landingPage: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      isBot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AnalyticsSession",
      tableName: "AnalyticsSessions",
      timestamps: true,
    }
  );

  // Initialize PageView model
  PageView.init(
    {
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      page: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      timeOnPage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      exitPage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      viewedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PageView",
      tableName: "PageViews",
      timestamps: true,
    }
  );

  // ADD: Define associations
  Travel.belongsTo(TravelCategory, {
    foreignKey: "travelCategoryId",
    as: "category",
  });

  TravelCategory.hasMany(Travel, {
    foreignKey: "travelCategoryId",
    as: "travels",
  });

  // Add Analytics associations
  AnalyticsSession.hasMany(PageView, {
    foreignKey: "sessionId",
    sourceKey: "sessionId",
    as: "pageViews",
  });

  PageView.belongsTo(AnalyticsSession, {
    foreignKey: "sessionId",
    targetKey: "sessionId",
    as: "session",
  });

  modelsInitialized = true;
  return {
    User,
    Article,
    Log,
    TravelCategory,
    Travel,
    AnalyticsSession,
    PageView,
  };
}

// Helper function to get models
export async function getModels() {
  return await initializeModels();
}
