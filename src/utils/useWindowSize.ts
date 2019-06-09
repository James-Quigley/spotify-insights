import { useEffect, useState } from 'react';

export default () => {
    const isClient = typeof window === 'object';
    function getSize() {
      return {
        width: isClient ? window.innerWidth : 0,
        height: isClient ? window.innerHeight : 0
      };
    }
    const [windowSize, setWindowSize] = useState(getSize);
    // @ts-ignore
    useEffect(() => {
      if (!isClient) {
        return false;
      }
      function handleResize() {
        setWindowSize(getSize());
      }
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return windowSize;
  }