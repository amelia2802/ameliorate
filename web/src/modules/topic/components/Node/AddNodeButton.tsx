import { Tooltip } from "@mui/material";

import { addNode } from "../../store/createDeleteActions";
import { type RelationDirection } from "../../utils/diagram";
import { Relation } from "../../utils/edge";
import { NodeType, nodeDecorations } from "../../utils/node";
import { StyledButton } from "./AddNodeButton.styles";

interface Props {
  fromNodeId: string;
  as: RelationDirection;
  toNodeType: NodeType;
  relation: Relation;
  className?: string;
}

export const AddNodeButton = ({ fromNodeId, as, toNodeType, relation, className }: Props) => {
  const decoration = nodeDecorations[toNodeType];

  return (
    <Tooltip title={`Add new ${decoration.title}`}>
      <StyledButton
        className={className}
        color={toNodeType}
        size="small"
        variant="contained"
        onClick={(event) => {
          event.stopPropagation(); // don't trigger selection of node
          void addNode({ fromNodeId, as, toNodeType, relation });
        }}
      >
        <decoration.NodeIcon />
      </StyledButton>
    </Tooltip>
  );
};
