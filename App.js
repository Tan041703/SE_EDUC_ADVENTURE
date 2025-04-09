import React from "react";
import Game from "./components/Game";
import "./App.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Game crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">Game temporarily unavailable</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="App">
      <h1 className="word-title">Educational Scramble Adventure</h1>
      <ErrorBoundary>
        <Game />
      </ErrorBoundary>
    </div>
  );
}

export default App;
