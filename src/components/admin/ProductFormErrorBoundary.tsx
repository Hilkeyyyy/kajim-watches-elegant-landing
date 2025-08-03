import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ProductFormErrorBoundaryProps {
  children: React.ReactNode;
}

interface ProductFormErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ProductFormErrorBoundary extends React.Component<
  ProductFormErrorBoundaryProps,
  ProductFormErrorBoundaryState
> {
  constructor(props: ProductFormErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ProductFormErrorBoundaryState {
    console.error('ProductFormErrorBoundary - Erro capturado:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProductFormErrorBoundary - Detalhes do erro:', error, errorInfo);
  }

  handleRetry = () => {
    console.log('ProductFormErrorBoundary - Tentando novamente');
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Erro ao carregar o formulário. {this.state.error?.message || 'Erro desconhecido'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="ml-4"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}