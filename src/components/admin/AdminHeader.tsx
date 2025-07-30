import React from "react";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const AdminHeader: React.FC = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "px-4 lg:px-6 h-16 flex items-center gap-4",
        isRTL ? "flex-row-reverse" : ""
      )}
    >
      {/* Sidebar Toggle */}
      <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />

      {/* Search Bar */}
      <div className={cn("flex-1 max-w-md", isRTL ? "mr-auto" : "ml-auto")}>
        <div className="relative">
          <Search
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )}
          />
          <Input
            type="search"
            placeholder={t("search")}
            className={cn(
              "w-full bg-muted/50 border-muted-foreground/20",
              isRTL ? "pr-10 text-right" : "pl-10"
            )}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse" : ""
        )}
      >
        {/* Language Switcher */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            >
              <Globe className="w-4 h-4" />
              <span className="sr-only">{t('language')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="min-w-32">
            <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setLanguage('en')}
              className={cn(
                'cursor-pointer',
                language === 'en' && 'bg-accent text-accent-foreground'
              )}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage('ar')}
              className={cn(
                'cursor-pointer',
                language === 'ar' && 'bg-accent text-accent-foreground'
              )}
            >
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-9 w-9 hover:bg-accent hover:text-accent-foreground"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
          <span className="sr-only">{t("theme")}</span>
        </Button>

        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 relative hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="w-4 h-4" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            >
              <User className="w-4 h-4" />
              <span className="sr-only">{t("profile")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@decorimic.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              {t("Settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
