// src/components/Modal.jsx
import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="
          bg-gray-900 text-white rounded-lg shadow-lg 
          w-full max-w-3xl  // makes popup much wider, try max-w-4xl for even wider
          max-h-[90vh]       // keeps the modal from overflowing vertically
          p-8 relative overflow-y-auto" // enables scroll inside modal
        style={{ minHeight: "200px" }}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-blue-400 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
