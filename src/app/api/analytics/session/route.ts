import { NextRequest, NextResponse } from "next/server";
import { getModels } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, page, referrer, userAgent } = body;

    const models = await getModels();

    // Detect device type
    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    const isBot = isBotRequest(userAgent);

    // Get client IP
    const ipAddress = getClientIP(request);

    // Create session
    await models.AnalyticsSession.create({
      sessionId,
      ipAddress,
      userAgent,
      deviceType,
      browser,
      os,
      referrer: referrer || null,
      landingPage: page,
      isBot,
      startTime: new Date(),
      // Additional data
      country: undefined, // Can be added with IP geolocation service
      city: undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

function detectDeviceType(
  userAgent: string
): "desktop" | "mobile" | "tablet" | "unknown" {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk|kindle/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua))
    return "mobile";
  return "desktop";
}

function detectBrowser(userAgent: string): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari")) return "Safari";
  if (ua.includes("edge")) return "Edge";
  if (ua.includes("opera")) return "Opera";
  return "unknown";
}

function detectOS(userAgent: string): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    return "iOS";
  return "unknown";
}

function isBotRequest(userAgent: string): boolean {
  if (!userAgent) return false;
  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "search",
    "google",
    "bing",
    "yahoo",
  ];
  return botPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
