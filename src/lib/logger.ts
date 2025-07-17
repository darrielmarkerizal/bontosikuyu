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
  static async log(data: LogData) {
    try {
      const sequelize = await getDatabase();

      const logEntry = {
        action: data.action,
        tableName: data.tableName || null,
        recordId: data.recordId || null,
        userId: data.userId || null,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
        newValues: data.newValues ? JSON.stringify(data.newValues) : null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await sequelize.query(
        `INSERT INTO Logs (action, tableName, recordId, userId, oldValues, newValues, ipAddress, userAgent, description, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            logEntry.action,
            logEntry.tableName,
            logEntry.recordId,
            logEntry.userId,
            logEntry.oldValues,
            logEntry.newValues,
            logEntry.ipAddress,
            logEntry.userAgent,
            logEntry.description,
            logEntry.createdAt,
            logEntry.updatedAt,
          ],
        }
      );

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
