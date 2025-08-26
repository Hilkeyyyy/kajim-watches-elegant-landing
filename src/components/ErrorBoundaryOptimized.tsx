import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You could also send error to monitoring service here
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
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
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