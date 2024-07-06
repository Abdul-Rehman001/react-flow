import React, { useState } from "react";
import "boxicons/css/boxicons.min.css";
import "./sidebar.css";

function Sidebar({ addNode, onDragStart, deleteNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [nodeToDelete, setNodeToDelete] = useState("");

  const handleDeleteNode = () => {
    if (nodeToDelete.trim() !== "") {
      deleteNode(nodeToDelete);
      setNodeToDelete("");
    }
  };

  const handleAddNode = () => {
    if (feedbackText.trim() !== "") {
      addNode("Send Message", {
        message: feedbackText,
        option: selectedOption,
      });
      setFeedbackText("");
      setSelectedOption(null);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const responseNodes = [
    {
      type: "Excellent",
      message:
        "Thank you very much! We would be happy if you leave your feedback below",
    },
    {
      type: "Not the best",
      message: "We're sorry to hear that! We'd be happy to find out more.",
    },
    {
      type: "Really poor",
      message: "We're sorry to hear that! We'd be happy to find out more.",
    },
  ];

  return (
    <div>
      <button onClick={toggleSidebar} className="toggle-sidebar-button">
        <i className="bx bx-menu"></i>
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="title">
          <h1>
            <i className="bx bxl-instagram-alt"></i> Send Message
          </h1>
        </div>
        <p className="para">Send within 24 hours Window</p>
        <div className="sidebar-content">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Enter feedback message"
            className="feedback-input"
          />
          <div className="option-buttons">
            {["Excellent", "Not the best", "Really poor"].map((option) => (
              <button
                key={option}
                className={`option-button ${
                  selectedOption === option ? "selected" : ""
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button onClick={handleAddNode} className="add-node-button">
            Add Node
          </button>
          <div className="delete-node-section">
            <input
              type="text"
              value={nodeToDelete}
              onChange={(e) => setNodeToDelete(e.target.value)}
              placeholder="Enter node ID to delete"
              className="node-delete-input"
            />
            <button onClick={handleDeleteNode} className="delete-node-button">
              Delete
            </button>
          </div>
        </div>
        <div className="response-nodes">
          <h3>Response Nodes</h3>

          {responseNodes.map((node, index) => (
            <div
              key={index}
              className="draggable-node"
              draggable
              onDragStart={(event) => onDragStart(event, node)}
            >
              {node.type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
