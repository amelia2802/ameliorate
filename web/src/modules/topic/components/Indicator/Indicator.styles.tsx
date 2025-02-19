import styled from "@emotion/styled";
import { Button } from "@mui/material";

import { indicatorLengthRem } from "../../utils/node";

export const StyledButton = styled(Button)`
  width: ${indicatorLengthRem}rem;
  min-width: ${indicatorLengthRem}rem;
  height: ${indicatorLengthRem}rem;
  margin-right: 2px;
  padding: 0px;

  &:hover > svg {
    color: ${({ theme }) => theme.palette.neutral.dark};
  }
`;
