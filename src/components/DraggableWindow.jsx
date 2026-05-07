import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export const DraggableWindow = ({ win, activeWindow, bringToFront, closeWindow, children, position }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: win.id,
  });

  const style = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    transform: transform 
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
        : undefined,
    zIndex: activeWindow === win.id ? 100 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`win95-window ${activeWindow === win.id ? 'active' : ''}`}
      onMouseDown={() => bringToFront(win.id)}
    >
      <div className="window-title-bar" {...listeners} {...attributes} style={{ cursor: 'grab' }}>
        <div className="window-title">{win.title}</div>
        <button 
          className="window-close-btn" 
          onClick={(e) => { 
            e.stopPropagation(); // Prevent triggering bringToFront when closing
            closeWindow(win.id); 
          }}
        >
          X
        </button>
      </div>
      <div className="window-content-area" style={{ userSelect: 'auto' }}>
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <div key={index} className="window-content-item">
                <div className="window-content-item-title">{child.title}</div>
                <div className="window-content-item-description">{child.description}</div>
                <div className="window-content-item-link"><a href={child.link} target="_blank" rel="noopener noreferrer">View Project</a></div>
                <div className="window-content-item-img"><img src={child.image} alt={child.title} /></div>
              </div>
            ))
          ) : (
            children
          )}
      </div>
    </div>
  );
};