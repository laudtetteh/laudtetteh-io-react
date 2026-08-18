/**
 * FlashActions
 * Renders the action buttons for a flash message (confirm/cancel, or an optional action link).
 * The dismiss "×" button lives inline in FlashMessage's header row, not here.
 */
import React from 'react';

export interface FlashActionsProps {
  type: 'success' | 'error' | 'info' | 'confirm';
  action?: { label: string; onClick: () => void };
  onConfirm?: (value: boolean) => void;
}

const FlashActions: React.FC<FlashActionsProps> = ({ type, action, onConfirm }) => {
  if (type === 'confirm' && onConfirm) {
    return (
      <div className="flex gap-4 justify-end w-full">
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

  if (!action) return null;

  return (
    <div className="flex justify-start w-full">
      <button
        onClick={action.onClick}
        className="text-sm text-white underline hover:text-gray-200"
      >
        {action.label}
      </button>
    </div>
  );
};

export default FlashActions;
