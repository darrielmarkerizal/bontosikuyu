import { getModels } from "./models";
import { NextRequest } from "next/server";

export interface LogData {
  action: "LOGIN" | "LOGOUT" | "CREATE";
  userId?: number;
  tableName?: string;
  recordId?: number;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export async function createLog(data: LogData, request?: NextRequest) {
  try {
    const models = await getModels();
    const { Log } = models;

    // Get IP address and user agent from request if provided
    let ipAddress = data.ipAddress;
    let userAgent = data.userAgent;

    if (request) {
      // Get IP address
      ipAddress =
        request.ip ||
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "unknown";

      // Get user agent
      userAgent = request.headers.get("user-agent") || "unknown";
    }

    await Log.create({
      action: data.action,
      tableName: data.tableName,
      recordId: data.recordId,
      userId: data.userId,
      oldValues: data.oldValues ? JSON.stringify(data.oldValues) : undefined,
      newValues: data.newValues ? JSON.stringify(data.newValues) : undefined,
      ipAddress,
      userAgent,
      description: data.description,
    });

    console.log(
      `Log created: ${data.action} - ${data.description || "No description"}`
    );
  } catch (error) {
    console.error("Failed to create log:", error);
  }
}
