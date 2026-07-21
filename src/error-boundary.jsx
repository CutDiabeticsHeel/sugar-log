import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary поймал ошибку:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h2>Что-то пошло не так 😔</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Попробовать снова</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;