import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Users,
  MessageSquare,
  Star,
  FolderOpen,
  Newspaper,
  Info,
  Phone,
  Award,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "services",
    url: "/admin",
    icon: Settings,
    exact: true,
  },
  {
    title: "aboutUs",
    url: "/admin/about",
    icon: Info,
  },
  {
    title: "whyChooseUs",
    url: "/admin/why-choose-us",
    icon: Award,
  },
  {
    title: "ourClients",
    url: "/admin/clients",
    icon: Users,
  },
  {
    title: "categories",
    url: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "ourProjects",
    url: "/admin/projects",
    icon: FolderOpen,
  },
  {
    title: "news",
    url: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "testimonials",
    url: "/admin/testimonials",
    icon: Star,
  },
  {
    title: "contactMessages",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  // {
  //   title: "contactInfo",
  //   url: "/admin/contact-info",
  //   icon: Phone,
  // },
];

export const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string, exact = false) => {
    const active = isActive(path, exact);
    return cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      "group relative overflow-hidden",
      {
        "bg-gradient-primary text-primary-foreground shadow-md": active,
        "text-sidebar-foreground": !active,
        "justify-center": collapsed,
        "flex-row-reverse": isRTL && !collapsed,
      }
    );
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "p-4 border-b border-sidebar-border bg-gradient-subtle",
          collapsed ? "px-2" : "px-4"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "justify-start",
            isRTL && !collapsed ? "flex-row-reverse" : ""
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-sidebar-foreground">
                Decor IMIC
              </h1>
              <span className="text-xs text-sidebar-foreground/70">
                Admin Dashboard
              </span>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider",
              collapsed && "sr-only"
            )}
          >
            {t("dashboard")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url, item.exact);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClassName(item.url, item.exact)}
                        title={collapsed ? t(item.title) : undefined}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            active
                              ? "text-primary-foreground"
                              : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                          )}
                        />
                        {!collapsed && (
                          <span
                            className={cn(
                              "font-medium transition-colors",
                              active
                                ? "text-primary-foreground"
                                : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                            )}
                          >
                            {t(item.title)}
                          </span>
                        )}

                        {/* Active indicator */}
                        {active && (
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-primary opacity-10 rounded-lg",
                              "animate-pulse"
                            )}
                          />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
