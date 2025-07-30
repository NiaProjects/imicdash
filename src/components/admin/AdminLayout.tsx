import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const AdminLayout: React.FC = () => {
  const { isRTL } = useLanguage();

  return (
    <SidebarProvider>
      <div className={cn(
        'min-h-screen flex w-full bg-background text-foreground',
        isRTL ? 'flex-row-reverse' : ''
      )}>
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          
          <main className={cn(
            'flex-1 overflow-auto',
            'bg-gradient-subtle'
          )}>
            <div className="container mx-auto px-4 lg:px-6 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};