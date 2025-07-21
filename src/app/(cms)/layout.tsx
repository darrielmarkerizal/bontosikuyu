"use client";

import { usePathname } from "next/navigation";
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
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Artikel",
    url: "/dashboard/artikel",
    icon: FileText,
  },
  {
    title: "Penulis",
    url: "/dashboard/penulis",
    icon: Users,
  },
  {
    title: "UMKM",
    url: "/dashboard/umkm",
    icon: Store,
  },
  {
    title: "Pariwisata",
    url: "/dashboard/pariwisata",
    icon: MapPin,
  },
  {
    title: "Log",
    url: "/dashboard/log",
    icon: LogIcon,
  },
  {
    title: "Monografis",
    url: "/dashboard/monografis",
    icon: BookOpen,
  },
  {
    title: "Statistik",
    url: "/dashboard/statistik",
    icon: BarChart3,
  },
  {
    title: "Admin",
    url: "/dashboard/admin",
    icon: Shield,
  },
];

const settingsItems = [
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Keluar",
    url: "/login",
    icon: LogOut,
  },
];

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPages = ["/login", "/register", "/forgot-password"];
  const isPublicPage = publicPages.some((page) => pathname.includes(page));

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
        { title: "Dashboard", href: "/dashboard" },
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
    <div className="h-screen overflow-hidden flex">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex flex-col gap-2 py-2 px-3">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Desa Laiyolo Baru
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    CMS Admin
                  </span>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex flex-col min-h-0 flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
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

          <main className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-4">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
