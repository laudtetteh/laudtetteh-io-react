/**
 * WysiwygCharacterCount
 * Displays the current and maximum character count.
 */
import React from 'react';

export interface WysiwygCharacterCountProps {
  current: number;
  limit: number;
}

const WysiwygCharacterCount: React.FC<WysiwygCharacterCountProps> = ({ current, limit }) => (
  <div className="px-4 pb-2 text-right text-sm text-gray-500">
    {current} / {limit} characters
  </div>
);

export default WysiwygCharacterCount;
