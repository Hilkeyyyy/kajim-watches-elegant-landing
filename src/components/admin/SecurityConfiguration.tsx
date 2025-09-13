import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, AlertTriangle, Shield, Settings, Database } from 'lucide-react';

interface SecurityTask {
  title: string;
  description: string;
  action: string;
  link: string | null;
  priority: 'high' | 'medium' | 'low' | 'completed';
}

export const SecurityConfiguration: React.FC = () => {
  const supabaseProjectId = 'nhzrqjlyaqxdjfnxuhht';

  const securityTasks = [
    {
      category: 'Supabase Authentication',
      icon: <Shield className="h-5 w-5" />,
      status: 'critical',
      tasks: [
        {
          title: 'Update OTP Expiry Time',
          description: 'Change from 86400s (24h) to 3600s (1h)',
          action: 'Configure in Supabase Auth settings',
          link: `https://supabase.com/dashboard/project/${supabaseProjectId}/auth/providers`,
          priority: 'high'
        },
        {
          title: 'Enable Leaked Password Protection',
          description: 'Protect against known compromised passwords',
          action: 'Enable in Auth settings',
          link: `https://supabase.com/dashboard/project/${supabaseProjectId}/auth/providers`,
          priority: 'high'
        },
        {
          title: 'Configure Rate Limiting',
          description: 'Set limits for signup/signin attempts',
          action: 'Configure in Auth rate limits',
          link: `https://supabase.com/dashboard/project/${supabaseProjectId}/auth/rate-limits`,
          priority: 'medium'
        }
      ]
    },
    {
      category: 'Database Security',
      icon: <Database className="h-5 w-5" />,
      status: 'good',
      tasks: [
        {
          title: 'PostgreSQL Version',
          description: 'Current version may have security patches available',
          action: 'Schedule upgrade in Supabase dashboard',
          link: `https://supabase.com/dashboard/project/${supabaseProjectId}/settings/infrastructure`,
          priority: 'medium'
        },
        {
          title: 'RLS Policies Enhanced',
          description: 'Audit log permissions have been restricted',
          action: 'Completed ✓',
          link: null,
          priority: 'completed'
        }
      ]
    },
    {
      category: 'Infrastructure',
      icon: <Settings className="h-5 w-5" />,
      status: 'pending',
      tasks: [
        {
          title: 'Security Headers',
          description: 'Configure CSP, HSTS, and other security headers',
          action: 'Add to vercel.json or CDN configuration',
          link: 'https://vercel.com/docs/projects/project-configuration#headers',
          priority: 'medium'
        },
        {
          title: 'Environment Security',
          description: 'Review environment variables and secrets',
          action: 'Audit in deployment settings',
          link: null,
          priority: 'low'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'pending': return 'secondary';
      case 'good': return 'default';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Action Required:</strong> Manual configuration needed in Supabase dashboard for optimal security.
          Database security policies have been automatically enhanced.
        </AlertDescription>
      </Alert>

      {securityTasks.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category.icon}
              {category.category}
              <Badge variant={getStatusColor(category.status)}>
                {category.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Security configuration tasks for {category.category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{task.title}</span>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    <p className="text-sm font-medium">
                      {task.action}
                    </p>
                  </div>
                  {task.link && (
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 border rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Configure
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
          <CardDescription>
            Follow these steps to complete security configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <strong>Supabase Auth Settings:</strong> Visit the authentication providers page and update OTP expiry to 3600s (1 hour)
            </li>
            <li>
              <strong>Enable Password Protection:</strong> Turn on leaked password protection in the same auth settings
            </li>
            <li>
              <strong>Rate Limiting:</strong> Configure appropriate rate limits for your user base
            </li>
            <li>
              <strong>Database Upgrade:</strong> Schedule PostgreSQL upgrade during maintenance window
            </li>
            <li>
              <strong>Security Headers:</strong> Add security headers to your deployment configuration
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};