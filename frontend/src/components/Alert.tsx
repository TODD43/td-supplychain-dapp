import React, { useState } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const alertClass = `alert-${type}`;

  return (
    <div className={alertClass} role="alert">
      <div className="flex justify-between items-start">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-xl font-bold hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
