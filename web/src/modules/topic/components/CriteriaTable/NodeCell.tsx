import { Node } from "../../utils/diagram";
import { EditableNode } from "../Node/EditableNode";
import { StyledDiv } from "./NodeCell.styles";

export const NodeCell = ({ node }: { node: Node }) => {
  return (
    <StyledDiv>
      <EditableNode node={node} />
    </StyledDiv>
  );
};
