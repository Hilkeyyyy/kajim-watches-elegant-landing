import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const isDev = import.meta.env.MODE === 'development';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundaryOptimized extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> | null {
    try {
      const name = (error as any)?.name || '';
      const rawMsg = (error as any)?.message || '';
      const msg = rawMsg.toLowerCase?.() || '';
      const stack = ((error as any)?.stack || '').toLowerCase?.() || '';

      const isIgnored =
        name === 'AbortError' ||
        (error as any)?.code === 'ERR_CANCELED' ||
        msg.includes('abort') ||
        msg.includes('request aborted') ||
        msg.includes('the user aborted') ||
        msg.includes('err_canceled') ||
        msg.includes('resizeobserver') ||
        msg.includes('resizeobserver loop limit exceeded') ||
        msg.includes('loop completed with undelivered notifications') ||
        msg.includes('chunkloaderror') ||
        msg.includes('loading chunk') ||
        msg.includes('loading css chunk') ||
        msg.includes('stylesheet not loaded') ||
        (msg.includes('dynamic import') && msg.includes('failed')) ||
        (msg.includes('navigation') && msg.includes('cancel')) ||
        msg.includes('the operation was aborted') ||
        msg.includes('failed to fetch') ||
        msg.includes('network request failed') ||
        msg.includes('networkerror when attempting to fetch resource') ||
        msg.includes('non-error promise rejection') ||
        msg.includes('promise rejection') ||
        msg.includes('cannot update a component while rendering a different component') ||
        msg.includes('state update on an unmounted component') ||
        msg.includes('minified react error') ||
        msg.includes('auth session missing') ||
        msg.includes('auth state change') ||
        msg.includes('token refresh') ||
        msg.includes('supabase') ||
        msg.includes('invalid login credentials') ||
        (rawMsg && rawMsg.length < 8) ||
        (rawMsg && rawMsg.trim() === '') ||
        stack.includes('resizeobserver') ||
        stack.includes('supabase') ||
        stack.includes('auth');

      if (isIgnored) {
        console.warn('ErrorBoundaryOptimized ignored error in render:', rawMsg || error);
        return null;
      }
    } catch {}

    console.error('ErrorBoundaryOptimized - Erro em render:', error);
    return { hasError: true, error } as Partial<State>;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const name = (error as any)?.name || '';
    const rawMsg = (error as any)?.message || '';
    const msg = rawMsg.toLowerCase?.() || '';
    const stack = ((error as any)?.stack || '').toLowerCase?.() || '';

    const isIgnored =
      name === 'AbortError' ||
      (error as any)?.code === 'ERR_CANCELED' ||
      msg.includes('abort') ||
      msg.includes('request aborted') ||
      msg.includes('the user aborted') ||
      msg.includes('err_canceled') ||
      msg.includes('resizeobserver') ||
      msg.includes('resizeobserver loop limit exceeded') ||
      msg.includes('loop completed with undelivered notifications') ||
      msg.includes('chunkloaderror') ||
      msg.includes('loading chunk') ||
      msg.includes('loading css chunk') ||
      msg.includes('stylesheet not loaded') ||
      (msg.includes('dynamic import') && msg.includes('failed')) ||
      (msg.includes('navigation') && msg.includes('cancel')) ||
      msg.includes('the operation was aborted') ||
      msg.includes('failed to fetch') ||
      msg.includes('network request failed') ||
      msg.includes('networkerror when attempting to fetch resource') ||
      msg.includes('non-error promise rejection') ||
      msg.includes('promise rejection') ||
      msg.includes('cannot update a component while rendering a different component') ||
      msg.includes('state update on an unmounted component') ||
      msg.includes('minified react error') ||
      msg.includes('auth session missing') ||
      msg.includes('auth state change') ||
      msg.includes('token refresh') ||
      msg.includes('supabase') ||
      msg.includes('invalid login credentials') ||
      (rawMsg && rawMsg.length < 8) ||
      (rawMsg && rawMsg.trim() === '') ||
      stack.includes('resizeobserver') ||
      stack.includes('supabase') ||
      stack.includes('auth');

    if (isIgnored) {
      console.warn('ErrorBoundaryOptimized ignored error in componentDidCatch:', rawMsg || error);
      return;
    }

    this.setState({ error, errorInfo });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-card/90 backdrop-blur-xl border border-border/30 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Algo deu errado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Ocorreu um erro inesperado. Tente recarregar a página ou volte à página inicial.
              </p>
              
              {isDev && this.state.error && (
                <details className="bg-muted/30 p-3 rounded-lg text-sm">
                  <summary className="cursor-pointer font-medium">Detalhes do erro (desenvolvimento)</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={this.handleReset}
                  className="flex-1 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1 gap-2"
                >
                  <Home className="h-4 w-4" />
                  Página Inicial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}