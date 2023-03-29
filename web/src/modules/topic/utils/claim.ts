import _ from "lodash";

import { ArguableType, Diagram, Edge, findArguable } from "./diagram";
import { maxCharsPerLine } from "./node";

export const parseClaimDiagramId = (diagramId: string) => {
  return diagramId.split("-") as [ArguableType, string];
};

export const getClaimDiagramId = (parentArguableId: string, parentArguableType: ArguableType) => {
  return `${parentArguableType}-${parentArguableId}`;
};

export const getRootArguable = (claimDiagramId: string, problemDiagram: Diagram) => {
  const [parentArguableType, parentArguableId] = parseClaimDiagramId(claimDiagramId);
  const arguable = findArguable(parentArguableId, parentArguableType, problemDiagram);
  return arguable;
};

// TODO: this should work for arguables. annoying to do without knowing the arguable type though.
// this will be much easier after adding the child claim diagram pointer to Arguable
export const hasClaims = (edge: Edge, diagram: Diagram, claimDiagrams: Diagram[]) => {
  const claimDiagramId = getClaimDiagramId(edge.id, "edge");
  const claimDiagram = claimDiagrams.find((diagram) => diagram.id === claimDiagramId);
  if (!claimDiagram) return false;

  return claimDiagram.nodes.length > 1; // one node will be the implicit claim, don't count that
};

// "parent" meaning the node or edge implies the claim
export const getImplicitLabel = (
  parentArguableId: string,
  parentArguableType: ArguableType,
  parentArguableDiagram: Diagram
): string => {
  if (parentArguableType === "node") {
    const parentNode = parentArguableDiagram.nodes.find((node) => node.id === parentArguableId);
    if (!parentNode) throw new Error("parent not found");

    const maxLabelLength = maxCharsPerLine * 2 - `""`.length; // hardcoded chars will fit in one line, so label can have the other two lines
    const truncatedNodeLabel = _.truncate(parentNode.data.label, { length: maxLabelLength });

    return `"${truncatedNodeLabel}" is important`;
  } else {
    const parentEdge = parentArguableDiagram.edges.find((edge) => edge.id === parentArguableId);
    if (!parentEdge) throw new Error("parent not found");

    const sourceNode = parentArguableDiagram.nodes.find((node) => node.id === parentEdge.source);
    const targetNode = parentArguableDiagram.nodes.find((node) => node.id === parentEdge.target);
    if (!sourceNode || !targetNode) throw new Error("edge nodes not found");

    const maxLabelLength = maxCharsPerLine - `""`.length; // hardcoded chars will fit in one line, so both labels can have their own line

    const truncatedSourceLabel = _.truncate(sourceNode.data.label, { length: maxLabelLength });
    const truncatedTargetLabel = _.truncate(targetNode.data.label, { length: maxLabelLength });

    return `"${truncatedTargetLabel}" ${parentEdge.label} "${truncatedSourceLabel}"`;
  }
};
