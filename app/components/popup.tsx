import React from 'react';
import { X } from 'lucide-react';

const ReusablePopup = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  description,
  icon,
  iconClassName = "w-24 h-24",
  buttons = [],
  showCloseButton = true,
  maxWidth = "max-w-md",
  className = "",
  overlayClassName = "",
  contentClassName = "",
}) => {
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={`fixed inset-0 bg-[#000000a1] bg-opacity-50 flex items-center justify-center z-50 ${overlayClassName}`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-[#1D1B11] border border-[#F3B753] rounded-lg p-6 w-full ${maxWidth} mx-4 relative ${className}`}>
        {/* Close button */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className={`${contentClassName}`}>
          {/* Icon */}
          {icon && (
            <div className="flex justify-center items-center mb-4">
              <div className={`rounded-full flex items-center justify-center mb-2 ${iconClassName}`}>
                {typeof icon === 'string' ? (
                  <img src={icon} className="w-full h-full object-contain" alt="Modal icon" />
                ) : (
                  icon
                )}
              </div>
            </div>
          )}

          {/* Header */}
          {(title || subtitle) && (
            <div className="text-center mb-4">
              {title && (
                <h2 className="text-xl font-semibold text-white mb-2">
                  {typeof title === 'string' ? <p>{title}</p> : title}
                </h2>
              )}
              {subtitle && (
                <h3 className="text-lg font-medium text-white">
                  {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
                </h3>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="text-gray-400 text-center mb-6">
              {typeof description === 'string' ? <p>{description}</p> : description}
            </div>
          )}

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className={`flex gap-3 ${buttons.length === 1 ? 'justify-center' : ''}`}>
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className={`
                    px-4 py-2 rounded-md transition-colors font-medium
                    ${button.variant === 'primary' 
                      ? 'bg-[#F3B753] text-black hover:bg-[#e6a945] disabled:bg-gray-600 disabled:text-gray-400' 
                      : 'bg-transparent border border-[#F3B753] text-[#F3B753] hover:bg-[#F3B753] hover:text-black disabled:border-gray-600 disabled:text-gray-400'
                    }
                    ${button.className || ''}
                    ${buttons.length > 1 ? 'flex-1' : 'px-8'}
                    disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400
                  `}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReusablePopup;
