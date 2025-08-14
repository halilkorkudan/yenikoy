import React from "react";

export function Button({ children, onClick, variant = "default", size = "md", className = "" }) {
  let baseClass = "px-4 py-2 rounded ";
  if (variant === "outline") baseClass += "border border-gray-500 ";
  else if (variant === "destructive") baseClass += "bg-red-600 text-white ";
  else baseClass += "bg-blue-600 text-white ";

  if (size === "sm") baseClass += "text-sm ";
  else if (size === "lg") baseClass += "text-lg ";

  return (
    <button onClick={onClick} className={`${baseClass} ${className}`}>
      {children}
    </button>
  );
}
