/**
 * FlashActions
 * Renders the action buttons for a flash message.
 */
import React from 'react';

export interface FlashActionsProps {
  type: 'success' | 'error' | 'info' | 'confirm';
  action?: { label: string; onClick: () => void };
  onClose: () => void;
  onConfirm?: (value: boolean) => void;
}

const FlashActions: React.FC<FlashActionsProps> = ({ type, action, onClose, onConfirm }) => {
  if (type === 'confirm' && onConfirm) {
    return (
      <div className="flex gap-4 justify-end w-full pt-2">
        <button
          onClick={() => onConfirm(false)}
          className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(true)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center w-full pt-2">
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-white underline hover:text-gray-200"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-300 text-lg leading-none"
        aria-label="Dismiss"
        title="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export default FlashActions;
