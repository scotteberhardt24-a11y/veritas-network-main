
"use client";
import React from "react";

export function Button({ children, onClick, disabled, className, style, type="button" }: any) {
  return <button type={type} onClick={onClick} disabled={disabled} className={className} style={{ padding:"10px 20px", background:"#1a6bff", border:"none", borderRadius:8, color:"white", fontWeight:700, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, ...style }}>{children}</button>;
}

export function LoadingSpinner({ size=24 }: any) {
  return <div style={{ width:size, height:size, border:"2px solid rgba(26,107,255,0.2)", borderTop:"2px solid #1a6bff", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>;
}

export function ErrorBanner({ message }: any) {
  if (!message) return null;
  return <div style={{ padding:"10px 14px", background:"rgba(255,85,85,0.08)", border:"1px solid rgba(255,85,85,0.25)", borderRadius:9, color:"#ff7777", fontSize:"0.85rem" }}>{message}</div>;
}

export function Card({ children, className, style }: any) {
  return <div className={className} style={{ background:"rgba(4,15,36,0.9)", border:"1px solid rgba(26,107,255,0.14)", borderRadius:16, padding:20, ...style }}>{children}</div>;
}
