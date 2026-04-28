"use client";

import { motion } from "framer-motion";

/**
 * Modern AI-style neural network loading animation
 * Features:
 * - Animated nodes with pulsing effect
 * - Connected lines forming a network
 * - Denim color theme integration
 * - Smooth fade in/out transitions
 */
export function Loader() {
    // Define node positions for neural network effect
    const nodes = [
        { id: 1, x: 0, y: 0, delay: 0 },
        { id: 2, x: 60, y: -40, delay: 0.1 },
        { id: 3, x: 60, y: 40, delay: 0.2 },
        { id: 4, x: 120, y: 0, delay: 0.3 },
        { id: 5, x: 40, y: 0, delay: 0.15 },
    ];

    // Define connections between nodes
    const connections = [
        { start: 0, end: 1 },
        { start: 0, end: 2 },
        { start: 0, end: 4 },
        { start: 1, end: 3 },
        { start: 2, end: 3 },
        { start: 4, end: 3 },
        { start: 1, end: 2 },
    ];

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <motion.div
                className="relative w-80 h-64 flex items-center justify-center"
                animate={{ y: [0, -6, 0] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* SVG for neural network connections */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="-100 -80 320 160"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient
                            id="lineGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                            <stop
                                offset="50%"
                                stopColor="rgb(37, 99, 235)"
                                stopOpacity="0.8"
                            />
                            <stop
                                offset="100%"
                                stopColor="rgb(29, 78, 216)"
                                stopOpacity="0.5"
                            />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Draw connections */}
                    {connections.map((conn, idx) => {
                        const startNode = nodes[conn.start];
                        const endNode = nodes[conn.end];
                        return (
                            <motion.line
                                key={`line-${idx}`}
                                x1={startNode.x}
                                y1={startNode.y}
                                x2={endNode.x}
                                y2={endNode.y}
                                stroke="url(#lineGradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                filter="url(#glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.6 }}
                                transition={{
                                    delay: 0.3 + idx * 0.1,
                                    duration: 1.5,
                                }}
                            />
                        );
                    })}

                    {/* Draw nodes */}
                    {nodes.map((node) => (
                        <g key={`node-${node.id}`}>
                            {/* Outer glow ring */}
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r="8"
                                fill="none"
                                stroke="rgb(59, 130, 246)"
                                strokeWidth="1"
                                opacity="0.3"
                                animate={{
                                    r: [8, 14, 8],
                                    opacity: [0.5, 0.1, 0.5],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: node.delay,
                                }}
                            />

                            {/* Inner animated node */}
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r="4"
                                fill="rgb(59, 130, 246)"
                                filter="url(#glow)"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: node.delay,
                                    duration: 0.5,
                                }}
                            />

                            {/* Node pulse animation */}
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r="4"
                                fill="rgb(59, 130, 246)"
                                filter="url(#glow)"
                                animate={{
                                    scale: [1, 1.3, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: node.delay,
                                }}
                            />
                        </g>
                    ))}
                </svg>

                {/* Loading text */}
                <motion.div
                    className="absolute bottom-0 flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <p className="text-sm font-medium text-slate-600">
                        Loading
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ...
                        </motion.span>
                    </p>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-denim-400 to-denim-600"
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    scale: [0.8, 1, 0.8],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
