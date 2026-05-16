import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md space-y-3">
            <h1 className="text-xl font-semibold text-red-400">Something broke.</h1>
            <pre className="text-xs bg-slate-900 p-3 rounded-md overflow-auto whitespace-pre-wrap">
              {this.state.error.message}
              {this.state.error.stack && `\n\n${this.state.error.stack}`}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-1"
            >
              Reload
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
