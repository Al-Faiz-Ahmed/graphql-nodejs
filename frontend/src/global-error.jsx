import { ErrorBoundary } from 'react-error-boundary'

// Fallback UI shown when any descendant throws during render.
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ padding: '16px', border: '1px solid #f00', color: '#900' }}>
      <h2>Something went wrong.</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error?.message}</pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: '8px' }}>
        Try again
      </button>
    </div>
  )
}

export default function GlobalErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  )
}

