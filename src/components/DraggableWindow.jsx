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
            children.map((item, index) => {
              if (typeof item === 'object' && item !== null) {
                return (
                  <div key={index} className="content-segment">
                    {item.title && <h3 className="project-title">{item.title}</h3>}
                    
                    {item.description && <p className="content-desc">{item.description}</p>}
                    
                    {item.link && (
                      <div className="project-links">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                      </div>
                    )}
                    
                    {item.image && (
                      <img 
                        className="content-image"
                        src={`${import.meta.env.BASE_URL}${item.image.startsWith('/') ? item.image.slice(1) : item.image}`} 
                        alt={item.title || "content image"} 
                      />
                    )}
                  </div>
                );
              }
              
              return <p key={index} className="contact-line">{item}</p>;
            })
          ) : (
            <p>{children}</p>
          )}
      </div>
    </div>
  );
};