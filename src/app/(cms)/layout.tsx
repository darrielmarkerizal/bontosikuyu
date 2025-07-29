"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Store,
  MapPin,
  FileText as LogIcon,
  BookOpen,
  LogOut,
  Settings,
  Shield,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

// Organized menu categories
const menuCategories = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
        description: "Ringkasan data utama",
      },
    ],
  },
  {
    title: "Konten",
    items: [
      {
        title: "Artikel",
        url: "/dashboard/artikel",
        icon: FileText,
        description: "Kelola artikel desa",
      },
      {
        title: "Penulis",
        url: "/dashboard/penulis",
        icon: Users,
        description: "Kelola penulis artikel",
      },
      {
        title: "Monografis",
        url: "/dashboard/monografis",
        icon: BookOpen,
        description: "Data monografis desa",
      },
    ],
  },
  {
    title: "Ekonomi & Pariwisata",
    items: [
      {
        title: "UMKM",
        url: "/dashboard/umkm",
        icon: Store,
        description: "Kelola UMKM desa",
      },
      {
        title: "Pariwisata",
        url: "/dashboard/pariwisata",
        icon: MapPin,
        description: "Kelola destinasi wisata",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Statistik",
        url: "/dashboard/statistik",
        icon: BarChart3,
        description: "Analisis data website",
      },
      {
        title: "Log Aktivitas",
        url: "/dashboard/log",
        icon: LogIcon,
        description: "Riwayat aktivitas sistem",
      },
      {
        title: "Admin",
        url: "/dashboard/admin",
        icon: Shield,
        description: "Kelola pengguna admin",
      },
    ],
  },
];

const quickActions = [
  {
    title: "Artikel Baru",
    icon: Plus,
    url: "/dashboard/artikel/tambah",
    variant: "default" as const,
  },
  {
    title: "Tambah UMKM",
    icon: Store,
    url: "/dashboard/umkm/tambah",
    variant: "outline" as const,
  },
  {
    title: "Tambah Wisata",
    icon: MapPin,
    url: "/dashboard/pariwisata/tambah",
    variant: "outline" as const,
  },
];

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const publicPages = ["/login", "/register", "/forgot-password"];
  const isPublicPage = publicPages.some((page) => pathname.includes(page));

  // Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      console.log("🚪 Logout process started");

      // Get token from cookies
      const token = Cookies.get("token");

      if (token) {
        // Call logout API to create log entry
        await axios.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ Logout API called successfully");
      }

      // Remove token from cookies
      Cookies.remove("token");
      console.log(" Token removed from cookies");

      // Show success message
      toast.success("Logout berhasil", {
        description: "Anda telah keluar dari sistem",
      });

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("💥 Logout error:", error);

      // Even if API call fails, still remove token and redirect
      Cookies.remove("token");

      toast.error("Logout gagal", {
        description:
          "Terjadi kesalahan saat logout, tetapi Anda telah keluar dari sistem",
      });

      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // For public pages (login, register, etc.), return children directly
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </div>
    );
  }

  // For dashboard pages, use the full layout with sidebar
  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  // Get breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    if (pathname === "/dashboard") {
      return [{ title: "Dashboard", href: "/dashboard", current: true }];
    }

    if (pathname.startsWith("/dashboard/artikel")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Artikel", href: "/dashboard/artikel", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/umkm")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "UMKM", href: "/dashboard/umkm", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/pariwisata")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Pariwisata", href: "/dashboard/pariwisata", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/penulis")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Penulis", href: "/dashboard/penulis", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/log")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Log", href: "/dashboard/log", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/monografis")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Monografis", href: "/dashboard/monografis", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/statistik")) {
      return [
        { title: "Dashboard", href: "/dashboard/statistik" },
        { title: "Statistik", href: "/dashboard/statistik", current: true },
      ];
    }

    if (pathname.startsWith("/dashboard/settings")) {
      return [
        { title: "Dashboard", href: "/dashboard" },
        { title: "Pengaturan", href: "/dashboard/settings", current: true },
      ];
    }

    return [{ title: "Dashboard", href: "/dashboard", current: true }];
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="h-screen overflow-hidden flex bg-gradient-to-br from-gray-50 to-gray-100">
      <SidebarProvider>
        <Sidebar
          className={`border-r border-border/40 shadow-lg backdrop-blur-sm bg-white/95 transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors z-10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>

          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex flex-col gap-2 py-4 px-3">
              <div className="flex items-center gap-3">
                {/* Logo Fallback */}
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Home className="w-5 h-5" />
                </div>
                {!sidebarCollapsed && (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">CMS Admin</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Desa Laiyolo Baru
                    </span>
                  </div>
                )}
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  Quick Actions
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="p-3 space-y-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.title}
                        size="sm"
                        variant={action.variant}
                        className="w-full justify-start h-8"
                        onClick={() => router.push(action.url)}
                      >
                        <action.icon className="w-3 h-3 mr-2" />
                        {action.title}
                      </Button>
                    ))}
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Menu Categories */}
            {menuCategories.map((category) => (
              <SidebarGroup key={category.title}>
                {!sidebarCollapsed && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                    {category.title}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          className="group"
                        >
                          <a href={item.url}>
                            <item.icon className="transition-transform group-hover:scale-110" />
                            {!sidebarCollapsed && <span>{item.title}</span>}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <div className="p-3">
              {/* User Profile */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">Admin</div>
                    <div className="text-xs text-muted-foreground truncate">
                      admin@laiyolobaru.com
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-2 space-y-1">
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings" className="text-sm">
                    <Settings className="w-4 h-4" />
                    {!sidebarCollapsed && <span>Pengaturan</span>}
                  </a>
                </SidebarMenuButton>
                <SidebarMenuButton
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  {!sidebarCollapsed && (
                    <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
                  )}
                </SidebarMenuButton>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex flex-col min-h-0 flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/80 backdrop-blur-sm shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <BreadcrumbItem key={index}>
                    {item.current ? (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
                {/* Render separators outside of BreadcrumbItem to avoid nested li */}
                {breadcrumbItems.map((item, index) =>
                  index < breadcrumbItems.length - 1 ? (
                    <BreadcrumbSeparator key={`separator-${index}`} />
                  ) : null
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-gray-100/50">
            <div className="p-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
