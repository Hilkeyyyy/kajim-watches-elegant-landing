import React from 'react';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { type AppError, errorHandler } from '@/utils/errorHandler';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

export const ErrorDisplay = React.memo(({ 
  error, 
  onRetry, 
  showDetails = false,
  className = "" 
}: ErrorDisplayProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  
  const suggestions = errorHandler.getActionSuggestions(error);

  return (
    <Card className={`border-destructive ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Erro
          <Badge variant="destructive" className="ml-auto">
            {error.type}
          </Badge>
        </CardTitle>
        <CardDescription>
          {errorHandler.getFriendlyMessage(error)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Suggestions */}
        <div>
          <h4 className="text-sm font-medium mb-2">O que você pode fazer:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          )}
          
          {showDetails && (
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isDetailsOpen ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Ocultar detalhes
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Ver detalhes
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-xs font-mono space-y-2">
                    <div><strong>Código:</strong> {error.code}</div>
                    <div><strong>Hora:</strong> {error.timestamp.toLocaleString()}</div>
                    <div><strong>Mensagem:</strong> {error.message}</div>
                    {error.details && (
                      <div>
                        <strong>Detalhes:</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                          {JSON.stringify(error.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";
