import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DraggableWindow } from './components/DraggableWindow';
import starterWindows from './components/starterWindows.json';
import './App.css';

const App = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [positions, setPositions] = useState({}); 

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px distance before drag starts
      },
    })
  );
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Boot Screen Timer
  useEffect(() => {
    if (isBooting) {
      const bootTimer = setTimeout(() => {
        setIsBooting(false);
      }, 5000);
      return () => clearTimeout(bootTimer);
    }
  }, [isBooting]);

  // Transition timer
  useEffect(() => {
    if (!isBooting && isTransitioning) {
      const transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(transitionTimer);
    }
  }, [isBooting, isTransitioning]);

  const bringToFront = (id) => {
    setActiveWindow(id);
  };

  const openWindow = (section) => {
    if (!openWindows.find(w => w.id === section.id)) {
      setOpenWindows([...openWindows, section]);
      if (!positions[section.id]) {
        setPositions(prev => ({
          ...prev,
          [section.id]: { x: 50 + (openWindows.length * 20), y: 50 + (openWindows.length * 20) }
        }));
      }
    }
    setActiveWindow(section.id);
  };

  const handleCloseWindow = (id) => {
    setOpenWindows((prev) => {
      const updatedWindows = prev.filter((w) => w.id !== id);
      
      if (activeWindow === id) {
        if (updatedWindows.length > 0) {
          setActiveWindow(updatedWindows[updatedWindows.length - 1].id);
        } else {
          setActiveWindow(null); // No windows left
        }
      }
      
      return updatedWindows;
    });
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;

    if (!delta || (delta.x === 0 && delta.y === 0)) return;

    setPositions((prev) => {
      const currentPos = prev[active.id] || { x: 50, y: 50 };
      
      return {
        ...prev,
        [active.id]: {
          x: currentPos.x + delta.x,
          y: currentPos.y + delta.y,
        },
      };
    });
  };

  const restrictToViewport = ({ transform, activeNodeRect }) => {
    if (!activeNodeRect) return transform;
    
    return {
      ...transform,
      x: Math.max(
        -activeNodeRect.left, 
        Math.min(transform.x, window.innerWidth - activeNodeRect.right)
      ),
      y: Math.max(
        -activeNodeRect.top, 
        Math.min(transform.y, window.innerHeight - activeNodeRect.bottom - 40) 
      ),
    };
  };  

  // Boot Screen 
  if (isBooting) {
    return (
      <div className="boot-screen">
        <div className="boot-text">
          <p>Award Modular BIOS v4.51PG, An Energy Star Ally</p>
          <p>Copyright (C) 1984-1995, Award Software, Inc.</p>
          <br/>
          <p>PORTFOLIO-OS 1.0 ACPI BIOS Revision 1001</p>
          <p>CPU : Intel(R) Pentium(R) Processor</p>
          <p>Memory Test :  32768K OK</p>
          <br/>
          <p>Initializing User Profile... OK</p>
          <p>Loading Creative Modules... OK</p>
          <p>Establishing Network Connections... OK</p>
          <br/>
          <p className="intro-highlight">Hello, I am Blake Robinson. Welcome to my interactive portfolio.</p>
          <br/>
          <p>Starting Windows 95... <span className="cursor">_</span></p>
        </div>
      </div>
    );
  }

  // Blank Transition Screen
  if (isTransitioning) {
    return (
      <div className="boot-screen"></div> 
    );
  }

  // Windows 95 Desktop
  return (
    <div className="win95-desktop">
      <DndContext 
        sensors={sensors} 
        onDragEnd={handleDragEnd}
        modifiers={[restrictToViewport]} 
      >
        <div className="icon-container">
          {starterWindows.map((section) => (
            <div key={section.id} className="desktop-icon" onDoubleClick={() => openWindow(section)}>
              <div className="icon-graphic">{section.icon}</div>
              <div className="icon-text">{section.title}</div>
            </div>
          ))}
        </div>

        {openWindows.map((win) => (
          <DraggableWindow
            key={win.id}
            win={win}
            position={positions[win.id] || { x: 50, y: 50 }}
            activeWindow={activeWindow}
            bringToFront={setActiveWindow}
            closeWindow={handleCloseWindow}
          >
            {win.content}
          </DraggableWindow>
        ))}
      </DndContext>


      <div className="win95-taskbar">
        <button className="start-button">
          <span className="start-logo">❖</span> Start
        </button>
        <div className="taskbar-divider"></div>
        <div className="taskbar-apps">
          {openWindows.map(win => (
            <button 
              key={`task-${win.id}`} 
              className={`taskbar-app-btn ${activeWindow === win.id ? 'active' : ''}`}
              onClick={() => bringToFront(win.id)}
            >
              {win.icon}
            </button>
          ))}
        </div>
        <div className="taskbar-tray">
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default App;