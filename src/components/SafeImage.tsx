import React from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  loader?: (resolverProps: { src: string; width?: number; quality?: number }) => string;
}

interface SafeImageState {
  hasError: boolean;
  showFallback: boolean;
}

/**
 * Safe Image component with error handling and fallbacks
 */
class SafeImage extends React.Component<SafeImageProps, SafeImageState> {
  constructor(props: SafeImageProps) {
    super(props);
    this.state = {
      hasError: false,
      showFallback: false,
    };
  }

  handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image load error:', this.props.src);
    this.setState({ hasError: true, showFallback: true });
    
    // Call the original onError if provided
    if (this.props.onError) {
      this.props.onError(e);
    }
  };

  static getDerivedStateFromProps(props: SafeImageProps, state: SafeImageState) {
    // Reset error state when src changes
    if (state.hasError && props.src) {
      return { hasError: false, showFallback: false };
    }
    return null;
  }

  render() {
    const { src, alt, className = '', ...otherProps } = this.props;
    
    if (!src || this.state.showFallback) {
      return (
        <div 
          className={`bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${className}`}
          {...(this.props.style && { style: this.props.style })}
        >
          <div className="text-gray-400 dark:text-gray-500 text-center">
            <svg 
              className="w-12 h-12 mx-auto mb-2" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <p className="text-sm">لا توجد صورة</p>
          </div>
        </div>
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        onError={this.handleError}
        {...otherProps}
      />
    );
  }
}

export default SafeImage;