
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    console.error('Detailed error information:', errorDetails);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    console.log('Retrying after error...');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    console.log('Navigating to home after error...');
    window.location.href = '/';
  };

  copyErrorToClipboard = () => {
    const { error, errorInfo } = this.state;
    const errorText = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
    `.trim();
    
    navigator.clipboard.writeText(errorText).then(() => {
      console.log('Error details copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy error details:', err);
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Algo deu errado</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado. Tente as opções abaixo para resolver o problema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Detalhes técnicos do erro
                  </summary>
                  <div className="mt-2 space-y-2">
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-24 whitespace-pre-wrap">
                        Component Stack: {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                    <Button 
                      onClick={this.copyErrorToClipboard}
                      variant="outline" 
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Bug className="h-3 w-3" />
                      Copiar Detalhes do Erro
                    </Button>
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={this.handleRetry} 
                  className="flex-1 gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar Novamente
                </Button>
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline" 
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

export default ErrorBoundary;
