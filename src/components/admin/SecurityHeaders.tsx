import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityHeader {
  name: string;
  description: string;
  present: boolean;
  recommended: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityHeaders: React.FC = () => {
  const [headers, setHeaders] = useState<SecurityHeader[]>([]);
  const [loading, setLoading] = useState(false);

  const checkSecurityHeaders = async () => {
    setLoading(true);
    try {
      // Make a HEAD request to check response headers
      const response = await fetch(window.location.origin, { method: 'HEAD' });
      const responseHeaders = response.headers;
      
      const securityHeaders: SecurityHeader[] = [
        {
          name: 'Content-Security-Policy',
          description: 'Prevents XSS attacks by controlling resource loading',
          present: responseHeaders.has('content-security-policy'),
          recommended: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
          severity: 'high'
        },
        {
          name: 'X-Frame-Options',
          description: 'Prevents clickjacking attacks',
          present: responseHeaders.has('x-frame-options'),
          recommended: 'DENY or SAMEORIGIN',
          severity: 'medium'
        },
        {
          name: 'X-Content-Type-Options',
          description: 'Prevents MIME type sniffing',
          present: responseHeaders.has('x-content-type-options'),
          recommended: 'nosniff',
          severity: 'medium'
        },
        {
          name: 'Referrer-Policy',
          description: 'Controls referrer information sent to other sites',
          present: responseHeaders.has('referrer-policy'),
          recommended: 'strict-origin-when-cross-origin',
          severity: 'low'
        },
        {
          name: 'Permissions-Policy',
          description: 'Controls browser feature access',
          present: responseHeaders.has('permissions-policy'),
          recommended: 'geolocation=(), microphone=(), camera=()',
          severity: 'low'
        },
        {
          name: 'Strict-Transport-Security',
          description: 'Enforces HTTPS connections',
          present: responseHeaders.has('strict-transport-security'),
          recommended: 'max-age=31536000; includeSubDomains',
          severity: 'high'
        }
      ];

      setHeaders(securityHeaders);
      
      // Show warning for critical missing headers
      const criticalMissing = securityHeaders.filter(h => !h.present && h.severity === 'critical');
      if (criticalMissing.length > 0) {
        toast.warning(`${criticalMissing.length} critical security headers missing!`);
      }
    } catch (error) {
      console.error('Failed to check security headers:', error);
      toast.error('Failed to check security headers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSecurityHeaders();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (present: boolean) => {
    return present ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-600" />
    );
  };

  const criticalMissing = headers.filter(h => !h.present && (h.severity === 'critical' || h.severity === 'high')).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Security Headers</span>
              <Badge variant={criticalMissing > 0 ? 'destructive' : 'secondary'}>
                {headers.filter(h => h.present).length}/{headers.length} Present
              </Badge>
            </CardTitle>
            <CardDescription>
              HTTP security headers help protect against common attacks
            </CardDescription>
          </div>
          <button
            onClick={checkSecurityHeaders}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 border rounded-md text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {criticalMissing > 0 && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {criticalMissing} critical security headers are missing. Configure these in your CDN or hosting provider.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {headers.map((header) => (
            <div
              key={header.name}
              className="flex items-start justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(header.present)}
                  <span className="font-medium">{header.name}</span>
                  <Badge variant={getSeverityColor(header.severity)}>
                    {header.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {header.description}
                </p>
                {!header.present && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Recommended:</strong> {header.recommended}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Configuration Notes:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Configure these headers in your CDN (Cloudflare, Vercel, etc.)</li>
            <li>• For Vercel: Add headers to vercel.json</li>
            <li>• For SPAs: Some headers may not appear in client-side checks</li>
            <li>• Test with online tools like securityheaders.com for accurate results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};