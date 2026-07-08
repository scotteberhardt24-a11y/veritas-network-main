
"use client";
import React from "react";

interface Props { children: React.ReactNode; fallback?: React.ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ minHeight:"100vh", background:"#010812", display:"flex", alignItems:"center", justifyContent:"center", color:"white", flexDirection:"column", gap:16, padding:24 }}>
          <div style={{ fontSize:"3rem" }}>⚠️</div>
          <div style={{ fontSize:"1.2rem", fontWeight:700 }}>Something went wrong</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", textAlign:"center", maxWidth:400 }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </div>
          <button onClick={() => this.setState({ hasError:false })}
            style={{ padding:"10px 24px", background:"rgba(26,107,255,0.1)", border:"1px solid rgba(26,107,255,0.25)", borderRadius:9, color:"#4da6ff", cursor:"pointer", fontWeight:600 }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
