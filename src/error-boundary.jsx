import React from 'react';
import {Link} from "react-router-dom";
import style from "./css/components/error-boundary.module.css";

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
        <div className={style.errorBlock}>
          <h2>Что-то пошло не так 😔</h2>
          <p className={style.errorText}>{this.state.error?.message}</p>
          <button onClick={this.handleReset} className={style.button}>Попробовать снова</button>
          <button type="button" onClick={() => window.location.reload()} className={style.button}>
            Перезагрузить страницу
          </button>
          <a href="/home" className={style.button}>Вернуться на главную</a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;