import { styled } from "styled-components";

interface LoadingProps {
  width: number;
  height: number;
}

export default function Loading(props: LoadingProps) {
  const { width, height } = props;
  return (
    <Wrapper width={width} height={height}>
      <div className="loading"></div>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading {
    width: 4rem;
    height: 4rem;
    box-sizing: border-box;
    position: relative;
    border-radius: 50%;
    border-top: 5px solid #60dbeb;
    border-left: 5px solid #60dbeb;
    border-bottom: 5px solid #60dbeb;
    border-right: 5px solid transparent;
    animation: 1.5s infinite rotate;
    animation-delay: 0.2s;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
