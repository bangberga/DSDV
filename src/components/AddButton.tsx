import { memo } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { styled } from "styled-components";
import { useLineChartContext } from "./providers/LineChartProvider";

export default function () {
  const { show, openTable } = useLineChartContext();

  return <MemoizedAddButton show={show} openTable={openTable} />;
}

interface MemoizedAddButtonProps {
  show: boolean;
  openTable: () => void;
}

const MemoizedAddButton = memo(function (props: MemoizedAddButtonProps) {
  const { show, openTable } = props;
  return (
    <ButtonWrapper show={show + ""}>
      <button onClick={openTable}>
        <IoIosAddCircle className="icon" /> Add country or region
      </button>
    </ButtonWrapper>
  );
});

const ButtonWrapper = styled.div<{ show: string }>`
  display: ${({ show }) => (show === "true" ? "block" : "none")};
  button {
    background: transparent;
    color: dodgerblue;
    font-weight: bold;
    border: none;
    display: flex;
    align-items: end;
    column-gap: 5px;
    padding: 0 10px;
    cursor: pointer;
    .icon {
      font-size: 1.3rem;
    }
  }
`;
