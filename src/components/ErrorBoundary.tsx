'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * ErrorBoundary — Catches rendering errors inside election modules so one
 * broken module does not crash the entire app. Logs to console in dev.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    // In production you could send this to Cloud Logging / Sentry here
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="w-full h-full flex flex-col items-center justify-center gap-6 text-center p-8"
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            This module encountered an error. Your progress is safe — you can go back and try again.
          </p>
        </div>
        <button
          onClick={this.handleReset}
          className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
        >
          Go Back
        </button>
      </div>
    );
  }
}
