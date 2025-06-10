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
  <div className="text-sm text-right text-gray-500 px-4 pb-2">
    {current} / {limit} characters
  </div>
);

export default WysiwygCharacterCount;
