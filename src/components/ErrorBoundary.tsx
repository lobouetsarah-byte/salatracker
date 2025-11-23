import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-background flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-8 space-y-6 shadow-2xl border-2 border-destructive/20">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-2xl bg-destructive/10">
                <AlertCircle className="w-16 h-16 text-destructive" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Une erreur s'est produite
              </h1>
              <p className="text-muted-foreground">
                L'application a rencontré une erreur inattendue. Veuillez recharger l'application.
              </p>
              {this.state.error && (
                <details className="text-xs text-left bg-muted/50 p-3 rounded-lg mt-4">
                  <summary className="cursor-pointer font-medium">Détails techniques</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            <Button
              onClick={this.handleReload}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Recharger l'application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
