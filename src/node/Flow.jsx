import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import "./flow.css";
import CustomNode from "../components/CustomNode";
import Sidebar from "../components/Sidebar";

const nodeTypes = {
  customNode: CustomNode,
};

const Flow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );
  const onInit = (rfi) => setReactFlowInstance(rfi);

  const getResponseMessage = (option) => {
    switch (option) {
      case "Excellent":
        return `Thank you very much! We would be happy if you leave your feedback below`;
      case "Not the best":
      case "Really poor":
        return "We're sorry to hear that! We'd be happy to find out more.";
      default:
        return "";
    }
  };

  const addNode = useCallback(
    (type, data) => {
      const newNode = {
        id: `${nodes.length + 1}`,
        type: "customNode",
        position: { x: 100, y: 100 + nodes.length * 150 },
        data: { ...data, type },
      };
      setNodes((nds) => [...nds, newNode]);

      if (data.option) {
        const responseNode = {
          id: `${nodes.length + 2}`,
          type: "customNode",
          position: { x: 400, y: 100 + nodes.length * 150 },
          data: {
            type: "Response",
            message: getResponseMessage(data.option),
          },
        };
        setNodes((nds) => [...nds, responseNode]);

        const newEdge = {
          id: `e${nodes.length + 1}-${nodes.length + 2}`,
          source: `${nodes.length + 1}`,
          target: `${nodes.length + 2}`,
          sourceHandle: `${nodes.length + 1}-${data.option}`,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { strokeWidth: 2 },
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    [nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const { clientX, clientY } = event;
      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const type = event.dataTransfer.getData("application/reactflow");
      const nodeData = JSON.parse(type);

      const newNode = {
        id: `${nodes.length + 1}`,
        type: "customNode",
        position,
        data: { ...nodeData, type: "Response" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes]
  );

  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, []);

  return (
    <div className="flow-container">
      <Sidebar
        addNode={addNode}
        onDragStart={onDragStart}
        deleteNode={deleteNode}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <div className="note">
          <p>👈Edit Nodes in Sidebar</p>
        </div>

        <Background
          className="flow-bg"
          color="blue"
          offset={2}
          variant={BackgroundVariant.Dots}
        />
        <MiniMap className="flow-map" />
        <Controls className="flow-control" />
      </ReactFlow>
    </div>
  );
};

export default Flow;
