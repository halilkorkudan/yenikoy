import * as React from "react";

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full text-sm text-left text-gray-700 ${className || ""}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>;
}

export function TableHead({ children, className }) {
  return <th className={`px-6 py-3 ${className || ""}`}>{children}</th>;
}

export function TableCell({ children, className }) {
  return <td className={`px-6 py-4 ${className || ""}`}>{children}</td>;
}
