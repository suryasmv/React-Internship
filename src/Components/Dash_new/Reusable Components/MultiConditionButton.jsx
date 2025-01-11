// MultiConditionButton.js
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

const MultiConditionButton = ({ preferences, sensors, handleDragEnd, closestCorners, handleSubmit }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <div className="multi_b">
      <Button
        onClick={() => setPopupVisible(true)}
        className="multi-condition-button"
        label="Multi-Condition"
      />
      <Dialog
        className="Dialog_hear"
        header={
          <div className="dialog-header">
            <span>Multiple Conditions</span>
          </div>
        }
        visible={popupVisible}
        style={{ width: '50vw' }} // Same width styling as the example
        onHide={() => setPopupVisible(false)}
      >
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <SortableContext items={preferences}>
            {preferences.map((task) => (
              <div className="SortableItem" key={task.id}>
                <label className="checkbox-title">
                  <input type="checkbox" className="checkbox" />
                  <span className="title">{task.title}</span>
                </label>
              </div>
            ))}
          </SortableContext>
        </DndContext>
        <div className="submit_multiconditions">
          <Button onClick={handleSubmit} label="Submit" />
        </div>
      </Dialog>
    </div>
  );
};

export default MultiConditionButton;
