import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Home, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { errorHandler } from '@/utils/errorHandler';

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
}

interface AdminErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class AdminErrorBoundary extends React.Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    const name = (error as any)?.name || '';
    const msg = ((error as any)?.message || '').toLowerCase?.() || '';
    const stack = ((error as any)?.stack || '').toLowerCase?.() || '';

    const isIgnored =
      name === 'AbortError' ||
      (error as any)?.code === 'ERR_CANCELED' ||
      msg.includes('abort') ||
      msg.includes('err_canceled') ||
      msg.includes('resizeobserver') ||
      msg.includes('chunkloaderror') ||
      msg.includes('loading chunk') ||
      (msg.includes('dynamic import') && msg.includes('failed')) ||
      (msg.includes('navigation') && msg.includes('cancel')) ||
      msg.includes('the operation was aborted') ||
      msg.includes('state update on an unmounted component') ||
      stack.includes('resizeobserver');

    if (isIgnored) {
      console.warn('AdminErrorBoundary - Erro não crítico ignorado:', error);
      return { hasError: false } as AdminErrorBoundaryState;
    }

    console.error('AdminErrorBoundary - Erro capturado:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const name = (error as any)?.name || '';
    const msg = ((error as any)?.message || '').toLowerCase?.() || '';
    const stack = ((error as any)?.stack || '').toLowerCase?.() || '';

    const isIgnored =
      name === 'AbortError' ||
      (error as any)?.code === 'ERR_CANCELED' ||
      msg.includes('abort') ||
      msg.includes('err_canceled') ||
      msg.includes('resizeobserver') ||
      msg.includes('chunkloaderror') ||
      msg.includes('loading chunk') ||
      (msg.includes('dynamic import') && msg.includes('failed')) ||
      (msg.includes('navigation') && msg.includes('cancel')) ||
      msg.includes('the operation was aborted') ||
      msg.includes('state update on an unmounted component') ||
      stack.includes('resizeobserver');

    if (isIgnored) {
      console.warn('AdminErrorBoundary - Erro ignorado:', error);
      return;
    }

    console.error('AdminErrorBoundary - Detalhes do erro:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Processa o erro com o sistema unificado
    errorHandler.handleError(error, 'AdminErrorBoundary');
  }

  handleRetry = () => {
    console.log('AdminErrorBoundary - Tentando recovery automático');
    try {
      // Limpar error handlers e caches
      errorHandler.clearErrors();
      
      // Reset do estado
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      
      // Recovery mais suave - tentar recarregar apenas o conteúdo
      setTimeout(() => {
        if (this.state.hasError) {
          console.log('AdminErrorBoundary - Recovery falhou, recarregando página');
          window.location.reload();
        }
      }, 2000);
      
    } catch (recoveryError) {
      console.error('AdminErrorBoundary - Erro no recovery:', recoveryError);
      window.location.reload();
    }
  };

  handleGoHome = () => {
    try {
      // Limpar estado de erro
      errorHandler.clearErrors();
      window.location.href = '/admin';
    } catch (error) {
      console.error('AdminErrorBoundary - Erro ao navegar:', error);
      window.location.reload();
    }
  };

  showErrorDetails = () => {
    if (this.state.error && this.state.errorInfo) {
      console.group('Detalhes do Erro - AdminErrorBoundary');
      console.error('Erro:', this.state.error);
      console.error('Stack:', this.state.error.stack);
      console.error('Component Stack:', this.state.errorInfo.componentStack);
      console.groupEnd();
    }
  };

  render() {
    if (this.state.hasError) {
      const appError = this.state.error ? errorHandler.handleError(this.state.error, 'Admin') : null;
      const friendlyMessage = appError ? errorHandler.getFriendlyMessage(appError) : 'Erro inesperado na área administrativa';
      const suggestions = appError ? errorHandler.getActionSuggestions(appError) : [];

      return (
        <div className="min-h-screen bg-background p-4 flex items-center justify-center">
          <Card className="max-w-2xl w-full">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Erro na Área Administrativa
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {friendlyMessage}
                  </p>
                </div>

                {suggestions.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Sugestões para resolver:</AlertTitle>
                    <AlertDescription className="mt-2">
                      <ul className="list-disc list-inside space-y-1">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={this.handleRetry} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Tentar Novamente
                  </Button>
                  
                  <Button variant="outline" onClick={this.handleGoHome} className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Ir ao Dashboard
                  </Button>
                  
                  <Button variant="ghost" onClick={this.showErrorDetails} className="flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Ver Detalhes Técnicos
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p>Erro ID: {Date.now()}</p>
                  <p>Timestamp: {new Date().toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}