import React from 'react';
import { useSwipeable } from 'react-swipeable';

const SwipeableContainer = ({ children }) => {

  const handlers = useSwipeable({
    onSwipedRight: () => {
      window.history.back();
    },
    preventDefaultTouchmoveEvent: true,
    delta: 50, 
  });

  return (
    <div {...handlers} className="h-full">
      {children}
    </div>
  );
};

export default SwipeableContainer; 