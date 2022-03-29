export interface NodeColor {
    border: string,
    background: string,
    highlight: {
        border: string,
        background: string
    },
    hover: {
        border: string,
        background: string
    }
}
export interface Theme {
    canvasBackground: string,
    highlight: {
        gradientInnerColor: string,
        gradientOutterColor: string,
    }
    expansion: {
        backgroudColorCollapsed: string,
        backgroudColorExpanded: string,
        fontColor: string
    }
    interaction?: {
        tooltipDelay: number,
        hideEdgesOnDrag?: boolean
    }
    edges: {
        width: number,
        font: {
            size: number,
            color: string,
            background : string
        },
        color: {
            inherit: string,
            opacity: number,
            color: string,
            highlight: string,
            hover: string,
        },
        selectionWidth: number,
        hoverWidth: number,
        arrows: {
            from?: {
                enabled: boolean,
                scaleFactor: number,
            },
            middle?: {
                enabled: boolean,
                scaleFactor: number,
            },
            to?: {
                enabled: boolean,
                scaleFactor: number,
            }
        },
        smooth: {
            enabled: boolean,
            type: string,
            roundness: number,
            forceDirection?: string
        }
    },
    nodes: {
        chosen? : boolean,
        color?: {
            border: string,
            background: string,
            opacity?: number
        },
        borderWidth: number,
        shape: string,
        scaling: {
            min: number,
            max: number
        },
        font: {
            size: number,
            strokeWidth: number
        }
    },
    groups?: {
        useSeqColors: boolean,
        SeqColors?: NodeColor[],
        custom?: {}
    },
    physics?: {
        enabled: true,
        barnesHut: {
            ravitationalConstant: number,
            centralGravity: number,
            damping: number,
            avoidOverlap: number,
            springLength: number,
        },
        maxVelocity: number,
        minVelocity: number,
        timestep: number
    }
}

export class Themes {
    static DEFAULT(): Theme {
        return {
            canvasBackground: "none",
            highlight: {
                gradientInnerColor: "#00FF00",
                gradientOutterColor: "#FFFFFF",
            },
            interaction: {
                tooltipDelay: 200,
            },
            expansion: {
                backgroudColorCollapsed: "rgba(127, 127, 127, 0.9)",
                backgroudColorExpanded: "rgba(0, 128, 0, 0.9)",
                fontColor: "#FFFFFF"
            },
            // https://github.com/almende/vis/issues/3146 (Nodes z-index)
            nodes: {
                chosen : true,
                borderWidth: 1,
                color: { border: "#000000", background: "#F5F5F5" },
                shape: 'box',
                scaling: {
                    min: 10,
                    max: 30
                },
                font: {
                    size: 10,
                    strokeWidth: 0
                }
            },
            edges: {
                width: 0.5,
                font: {
                    size: 9,
                    color: 'gray',
                    background:'white'
                },
                color: {
                    inherit: 'to',
                    opacity: 0.4,
                    color: '#cccccc',
                    highlight: '#ff0000',
                    hover: '#ff0000',
                },
                selectionWidth: 0.05,
                hoverWidth: 0.05,
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.5,
                    },
                    
                },
                // Overlaping issue : https://github.com/almende/vis/issues/1957
                smooth: {
                    enabled: true,
                    type: 'continuous',
                    roundness: 0                    
                }
            }
        };
    }

    // Testing purpose, always default theme will be applicable
    static TEST(): Theme {
        return {
            canvasBackground: "#111111",
            highlight: {
                gradientInnerColor: "yellow",
                gradientOutterColor: "black",
            },
            expansion: {
                backgroudColorCollapsed: "rgba(255, 0, 0, 0.9)",
                backgroudColorExpanded: "rgba(0, 255, 0, 0.5)",
                fontColor: "#FFFFFF"
            },
            nodes: {
                borderWidth: 0,
                shape: 'box',
                scaling: {
                    min: 10,
                    max: 30
                },
                font: {
                    size: 14,
                    strokeWidth: 7
                }
            },
            edges: {
                width: 0.01,
                font: {
                    size: 11,
                    color: 'green',
                    background : 'white'
                },
                color: {
                    inherit: 'to',
                    opacity: 0.4,
                    color: '#cccccc',
                    highlight: '#ff0000',
                    hover: '#ff0000',
                },
                selectionWidth: 0.05,
                hoverWidth: 0.05,
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.5,
                    }
                },
                smooth: {
                    enabled: true,
                    type: 'continuous',
                    roundness: 0.5,
                }
            }
        };
    }
}