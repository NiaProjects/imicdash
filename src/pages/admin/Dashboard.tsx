import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Settings,
  Plus,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className
}) => {
  const { isRTL } = useLanguage();

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-200 hover:shadow-lg group',
      'bg-gradient-card border-border/50',
      className
    )}>
      <CardHeader className={cn(
        'flex flex-row items-center justify-between space-y-0 pb-2',
        isRTL ? 'flex-row-reverse' : ''
      )}>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className={cn(
            'flex items-center mt-2 text-xs',
            isRTL ? 'flex-row-reverse' : ''
          )}>
            <ArrowUpRight className={cn(
              'w-3 h-3',
              trend.isPositive ? 'text-success' : 'text-destructive rotate-180',
              isRTL ? 'ml-1' : 'mr-1'
            )} />
            <span className={trend.isPositive ? 'text-success' : 'text-destructive'}>
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const stats = [
    {
      title: t('totalServices'),
      value: 12,
      description: '+2 this month',
      icon: <Settings className="w-4 h-4" />,
      trend: { value: '+16.7%', isPositive: true }
    },
    {
      title: t('totalTestimonials'),
      value: 48,
      description: '+5 this week',
      icon: <Star className="w-4 h-4" />,
      trend: { value: '+12.3%', isPositive: true }
    },
    {
      title: t('unreadMessages'),
      value: 7,
      description: 'Requires attention',
      icon: <MessageSquare className="w-4 h-4" />,
      trend: { value: '-8.1%', isPositive: false }
    },
    {
      title: t('totalProjects'),
      value: 156,
      description: '+23 this quarter',
      icon: <BarChart3 className="w-4 h-4" />,
      trend: { value: '+18.9%', isPositive: true }
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New testimonial received',
      user: 'Ahmed Mohammed',
      time: '2 hours ago',
      type: 'testimonial'
    },
    {
      id: 2,
      action: 'Service updated',
      user: 'Admin User',
      time: '4 hours ago',
      type: 'service'
    },
    {
      id: 3,
      action: 'New project added',
      user: 'Admin User',
      time: '1 day ago',
      type: 'project'
    },
    {
      id: 4,
      action: 'Contact message received',
      user: 'Sara Ahmed',
      time: '2 days ago',
      type: 'message'
    }
  ];

  const quickActions = [
    { title: 'Add New Service', icon: Settings, color: 'bg-primary' },
    { title: 'Add Project', icon: Plus, color: 'bg-accent' },
    { title: 'View Messages', icon: MessageSquare, color: 'bg-success' },
    { title: 'Manage Clients', icon: Users, color: 'bg-warning' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={cn(
        'flex items-center justify-between',
        isRTL ? 'flex-row-reverse' : ''
      )}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your Decor IMIC website.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Content
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className={cn(
              'flex items-center gap-2',
              isRTL ? 'flex-row-reverse' : ''
            )}>
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates and changes to your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors',
                    isRTL ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    activity.type === 'testimonial' && 'bg-success',
                    activity.type === 'service' && 'bg-primary',
                    activity.type === 'project' && 'bg-accent',
                    activity.type === 'message' && 'bg-warning'
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Commonly used administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-auto p-3',
                    'hover:bg-muted/50 transition-all duration-200',
                    isRTL ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    action.color,
                    isRTL ? 'ml-3' : 'mr-3'
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {action.title}
                  </span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className={cn(
            'flex items-center gap-2',
            isRTL ? 'flex-row-reverse' : ''
          )}>
            <TrendingUp className="w-5 h-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Website engagement and content performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">98.5%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-success mb-1">1.2k</div>
              <div className="text-sm text-muted-foreground">Monthly Visitors</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-accent mb-1">4.8/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;