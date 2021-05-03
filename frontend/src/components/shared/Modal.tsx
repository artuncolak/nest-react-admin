import { HTMLProps, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  show: boolean;
}

export default function Modal({ children, className, show }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (show) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 150);
    }

    return () => clearTimeout(timeout);
  }, [show]);

  return createPortal(
    <div
      className={`absolute inset-0 z-50 bg-gray-900 bg-opacity-20 w-full h-full 
flex justify-center items-center backdrop-filter backdrop-blur transition-opacity ${
        show ? 'opacity-100' : 'opacity-0'
      } ${isVisible ? 'visible' : 'invisible'}`}
    >
      <div className={'w-3/4 sm:w-1/2 card shadow relative ' + className}>
        {children}
      </div>
    </div>,
    document.getElementById('modal'),
  );
}
