/**
 * FlashIcon
 * Renders the icon for a given flash message type.
 */
import React from 'react';

export interface FlashIconProps {
  type: 'success' | 'error' | 'info' | 'confirm';
}

const ICONS: Record<FlashIconProps['type'], string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  confirm: '❓',
};

const FlashIcon: React.FC<FlashIconProps> = ({ type }) => (
  <span className="text-xl">{ICONS[type]}</span>
);

export default FlashIcon;
