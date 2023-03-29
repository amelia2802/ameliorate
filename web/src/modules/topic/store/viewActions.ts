import { getClaimDiagramId, getImplicitLabel } from "../utils/claim";
import {
  ArguableType,
  RelationDirection,
  buildNode,
  findArguable,
  findNode,
  layoutVisibleComponents,
  problemDiagramId,
} from "../utils/diagram";
import { NodeType, children, parents } from "../utils/node";
import { getDiagram } from "./actions";
import { useTopicStore } from "./store";
import { getActiveDiagram, getClaimDiagrams } from "./utils";

export const viewOrCreateClaimDiagram = (arguableId: string, arguableType: ArguableType) => {
  useTopicStore.setState(
    (state) => {
      const diagramId = getClaimDiagramId(arguableId, arguableType);

      // create claim diagram if it doesn't exist
      if (!getDiagram(diagramId)) {
        const activeDiagram = getActiveDiagram(state);
        const arguable = findArguable(arguableId, arguableType, activeDiagram);
        const label = getImplicitLabel(arguableId, arguableType, activeDiagram);

        /* eslint-disable functional/immutable-data, no-param-reassign */
        const newNode = buildNode({
          id: `${state.nextNodeId++}`,
          label: label,
          score: arguable.data.score,
          type: "rootClaim",
          diagramId: diagramId,
        });

        state.diagrams[diagramId] = {
          id: diagramId,
          nodes: [newNode],
          edges: [],
          type: "claim",
        };
        /* eslint-enable functional/immutable-data, no-param-reassign */
      }

      /* eslint-disable functional/immutable-data, no-param-reassign */
      state.activeClaimDiagramId = diagramId;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "viewOrCreateClaimDiagram"
  );
};

export const viewClaimDiagram = (diagramId: string) => {
  useTopicStore.setState(
    (state) => {
      /* eslint-disable functional/immutable-data, no-param-reassign */
      state.activeClaimDiagramId = diagramId;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "viewClaimDiagram"
  );
};

export const closeClaimDiagram = () => {
  useTopicStore.setState(
    (state) => {
      /* eslint-disable functional/immutable-data, no-param-reassign */
      state.activeClaimDiagramId = null;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "closeClaimDiagram"
  );
};

export const closeTable = () => {
  useTopicStore.setState(
    (state) => {
      /* eslint-disable functional/immutable-data, no-param-reassign */
      state.activeTableProblemId = null;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "closeTable"
  );
};

// potential TODO: could show components that were hidden due to being implied by the now-hidden neighbor
export const toggleShowNeighbors = (
  nodeId: string,
  neighborType: NodeType,
  direction: RelationDirection,
  show: boolean
) => {
  useTopicStore.setState(
    (state) => {
      const problemDiagram = state.diagrams[problemDiagramId]; // assuming we're only show/hiding from problem diagram

      const node = findNode(nodeId, problemDiagram);

      const neighborsInDirection =
        direction === "parent" ? parents(node, problemDiagram) : children(node, problemDiagram);

      const neighborsToToggle = neighborsInDirection.filter(
        (neighbor) => neighbor.type === neighborType
      );

      /* eslint-disable functional/immutable-data, no-param-reassign */
      neighborsToToggle.forEach((neighbor) => (neighbor.data.showing = show));
      /* eslint-enable functional/immutable-data, no-param-reassign */

      const layoutedDiagram = layoutVisibleComponents(problemDiagram, getClaimDiagrams(state)); // depends on showing having been updated

      /* eslint-disable functional/immutable-data, no-param-reassign */
      problemDiagram.nodes = layoutedDiagram.nodes;
      problemDiagram.edges = layoutedDiagram.edges;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "toggleShowNeighbors"
  );
};

export const viewProblemDiagram = () => {
  useTopicStore.setState(
    (state) => {
      /* eslint-disable functional/immutable-data, no-param-reassign */
      state.activeTableProblemId = null;
      state.activeClaimDiagramId = null;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "viewProblemDiagram"
  );
};

export const viewCriteriaTable = (problemNodeId: string) => {
  useTopicStore.setState(
    (state) => {
      /* eslint-disable functional/immutable-data, no-param-reassign */
      state.activeTableProblemId = problemNodeId;
      state.activeClaimDiagramId = null;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "viewCriteriaTable"
  );
};

export const relayout = () => {
  useTopicStore.setState(
    (state) => {
      const activeDiagram = getActiveDiagram(state);

      const layoutedDiagram = layoutVisibleComponents(activeDiagram, getClaimDiagrams(state));

      /* eslint-disable functional/immutable-data, no-param-reassign */
      activeDiagram.nodes = layoutedDiagram.nodes;
      activeDiagram.edges = layoutedDiagram.edges;
      /* eslint-enable functional/immutable-data, no-param-reassign */
    },
    false,
    "relayout"
  );
};
