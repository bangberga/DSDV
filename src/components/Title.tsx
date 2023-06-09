import { styled } from "styled-components";
import { useYearContext } from "./providers/YearProvider";
import { useWorldMapContext } from "./providers/WorldMapProider";

interface TitleProps {
  title: string;
  subTitle: string;
}

export default function (props: TitleProps) {
  const { title, subTitle } = props;
  const { show } = useWorldMapContext();
  const { year } = useYearContext();
  return (
    <Wrapper>
      <h2>
        {title}
        {show && `, ${year}`}
      </h2>
      <p>{subTitle}</p>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin-bottom: 1rem;
  h2 {
    font-weight: 500;
  }
  p {
    font-weight: 400;
    color: gray;
  }
`;
