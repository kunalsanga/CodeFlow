import "@/styles/globals.css";
import React from "react";

export const metadata = {
  title: "CodeFlow — AI-Powered Code Execution & Data Structure Visualizer",
  description: "Interactive step-by-step code execution visualizer for Python algorithms."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full w-full bg-[#0d1117] text-[#c9d1d9] antialiased">
        {children}
      </body>
    </html>
  );
}
