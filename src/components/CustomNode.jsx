import React from "react";
import { Handle, Position } from "reactflow";
import "./customnode.css";

function CustomNode({ data, id }) {
  const options = ["Excellent", "Not the best", "Really poor"];

  return (
    <div className={`custom-node ${data.type.toLowerCase()}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-content">
        <h3 className="message-title">
          <i className="bx bxl-instagram-alt insta-icon"></i> {data.type}
        </h3>
        <p className="description">{data.message}</p>
        {data.type === "Send Message" && (
          <div className="node-options">
            {options.map((option) => (
              <div key={option} className="option-handle-wrapper">
                <span
                  className={`option ${option.toLowerCase().replace(" ", "-")}`}
                >
                  {option}
                </span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${id}-${option}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {data.type !== "Send Message" && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
}

export default CustomNode;
