import { getDatabase } from "./database";

interface LogData {
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
  oldValues?: object;
  newValues?: object;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
}

export class Logger {
  // Get models instance
  private static async getModels() {
    const db = require("../../models");
    return db;
  }

  static async log(data: LogData) {
    try {
      const models = await this.getModels();

      await models.Log.create({
        action: data.action,
        tableName: data.tableName || null,
        recordId: data.recordId || null,
        userId: data.userId || null,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
        newValues: data.newValues ? JSON.stringify(data.newValues) : null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        description: data.description || null,
      });

      console.log(
        `Log created: ${data.action} on ${data.tableName || "system"}`
      );
    } catch (error) {
      console.error("Failed to create log:", error);
      // Don't throw error to prevent breaking main functionality
    }
  }

  // Helper methods for common actions
  static async logCreate(
    tableName: string,
    recordId: number,
    newValues: object,
    userId?: number,
    req?: any
  ) {
    await this.log({
      action: "CREATE",
      tableName,
      recordId,
      newValues,
      userId,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers["user-agent"],
      description: `Created new ${tableName} record`,
    });
  }

  static async logUpdate(
    tableName: string,
    recordId: number,
    oldValues: object,
    newValues: object,
    userId?: number,
    req?: any
  ) {
    await this.log({
      action: "UPDATE",
      tableName,
      recordId,
      oldValues,
      newValues,
      userId,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers["user-agent"],
      description: `Updated ${tableName} record`,
    });
  }

  static async logDelete(
    tableName: string,
    recordId: number,
    oldValues: object,
    userId?: number,
    req?: any
  ) {
    await this.log({
      action: "DELETE",
      tableName,
      recordId,
      oldValues,
      userId,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers["user-agent"],
      description: `Deleted ${tableName} record`,
    });
  }

  static async logLogin(userId: number, req?: any) {
    await this.log({
      action: "LOGIN",
      userId,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers["user-agent"],
      description: "User logged in",
    });
  }

  static async logLogout(userId: number, req?: any) {
    await this.log({
      action: "LOGOUT",
      userId,
      ipAddress: this.getClientIP(req),
      userAgent: req?.headers["user-agent"],
      description: "User logged out",
    });
  }

  // Get logs with filters and pagination
  static async getLogs(
    options: {
      page?: number;
      limit?: number;
      action?: string;
      tableName?: string;
      userId?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ) {
    try {
      const models = await this.getModels();
      const { Op } = require("sequelize");

      const {
        page = 1,
        limit = 50,
        action,
        tableName,
        userId,
        startDate,
        endDate,
      } = options;

      const offset = (page - 1) * limit;
      const where: any = {};

      if (action) where.action = action;
      if (tableName) where.tableName = tableName;
      if (userId) where.userId = userId;
      if (startDate) where.createdAt = { [Op.gte]: startDate };
      if (endDate) {
        where.createdAt = {
          ...where.createdAt,
          [Op.lte]: endDate,
        };
      }

      const { count, rows } = await models.Log.findAndCountAll({
        where,
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["fullName", "email"],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        filters: {
          action,
          tableName,
          userId,
          startDate,
          endDate,
        },
      };
    } catch (error) {
      console.error("Failed to get logs:", error);
      throw error;
    }
  }

  // Get log statistics
  static async getLogStats(days: number = 30) {
    try {
      const models = await this.getModels();
      const { Op, fn, col, literal } = require("sequelize");

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Action statistics
      const actionStats = await models.Log.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
        },
        attributes: ["action", [fn("COUNT", col("id")), "count"]],
        group: ["action"],
        order: [[literal("count"), "DESC"]],
        raw: true,
      });

      // Table statistics
      const tableStats = await models.Log.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
          tableName: {
            [Op.not]: null,
          },
        },
        attributes: ["tableName", [fn("COUNT", col("id")), "count"]],
        group: ["tableName"],
        order: [[literal("count"), "DESC"]],
        raw: true,
      });

      // Daily activity (last 30 days)
      const dailyStats = await models.Log.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
        },
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("id")), "count"],
        ],
        group: [fn("DATE", col("createdAt"))],
        order: [[fn("DATE", col("createdAt")), "DESC"]],
        raw: true,
      });

      // Top users by activity
      const userStats = await models.Log.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
          userId: {
            [Op.not]: null,
          },
        },
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["fullName", "email"],
            required: true,
          },
        ],
        attributes: ["userId", [fn("COUNT", col("Log.id")), "activityCount"]],
        group: ["userId", "user.id", "user.fullName", "user.email"],
        order: [[literal("activityCount"), "DESC"]],
        limit: 10,
        raw: true,
      });

      return {
        actionStats,
        tableStats,
        dailyStats,
        userStats,
      };
    } catch (error) {
      console.error("Failed to get log statistics:", error);
      throw error;
    }
  }

  // Get recent logs for a specific user
  static async getUserLogs(userId: number, limit: number = 20) {
    try {
      const models = await this.getModels();

      const logs = await models.Log.findAll({
        where: { userId },
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["fullName", "email"],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
      });

      return logs;
    } catch (error) {
      console.error("Failed to get user logs:", error);
      throw error;
    }
  }

  // Get recent logs for a specific table/record
  static async getRecordLogs(
    tableName: string,
    recordId: number,
    limit: number = 10
  ) {
    try {
      const models = await this.getModels();

      const logs = await models.Log.findAll({
        where: {
          tableName,
          recordId,
        },
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["fullName", "email"],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
      });

      return logs;
    } catch (error) {
      console.error("Failed to get record logs:", error);
      throw error;
    }
  }

  // Helper untuk mendapatkan IP client
  private static getClientIP(req: any): string | undefined {
    if (!req) return undefined;

    return (
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip
    );
  }
}
