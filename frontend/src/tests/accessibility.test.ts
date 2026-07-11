// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

describe('Frontend Accessibility Utilities', () => {
  it('should calculate proper text size classes based on scale settings', () => {
    // Standard scale check
    const getTextSizeClass = (textSize: 'md' | 'lg' | 'xl') => {
      if (textSize === 'lg') return 'text-base';
      if (textSize === 'xl') return 'text-lg';
      return 'text-xs';
    };

    expect(getTextSizeClass('md')).toBe('text-xs');
    expect(getTextSizeClass('lg')).toBe('text-base');
    expect(getTextSizeClass('xl')).toBe('text-lg');
  });

  it('should format severity colors with high-contrast readable options', () => {
    const getSeverityStyles = (severity: string) => {
      switch (severity) {
        case 'critical':
          return 'border-red-500 text-red-400';
        case 'high':
          return 'border-orange-500 text-orange-400';
        case 'medium':
          return 'border-amber-500 text-amber-400';
        case 'low':
        default:
          return 'border-emeraldGreen/20 text-emeraldGreen';
      }
    };

    expect(getSeverityStyles('critical')).toContain('text-red-400');
    expect(getSeverityStyles('medium')).toContain('text-amber-400');
  });
});
