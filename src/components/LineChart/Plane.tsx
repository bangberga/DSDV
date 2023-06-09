import { MouseEvent, RefObject, memo } from "react";
import { useLineChartContext } from "../providers/LineChartProvider";

export default function () {
  const {
    innerWidth,
    innerHeight,
    planeRef,
    mousemove,
    mouseenter,
    mouseleave,
  } = useLineChartContext();

  return (
    <MemoizedPlane
      planeRef={planeRef}
      innerWidth={innerWidth}
      innerHeight={innerHeight}
      mousemove={mousemove}
      mouseenter={mouseenter}
      mouseleave={mouseleave}
    />
  );
}

interface MemoizedPlaneProps {
  planeRef: RefObject<SVGRectElement>;
  innerWidth: number;
  innerHeight: number;
  mousemove: (e: MouseEvent<SVGRectElement, globalThis.MouseEvent>) => void;
  mouseenter: () => void;
  mouseleave: () => void;
}

const MemoizedPlane = memo(function (props: MemoizedPlaneProps) {
  const {
    planeRef,
    innerHeight,
    innerWidth,
    mousemove,
    mouseenter,
    mouseleave,
  } = props;
  return (
    <rect
      ref={planeRef}
      width={innerWidth}
      height={innerHeight}
      fill="none"
      pointerEvents={"all"}
      onMouseMove={mousemove}
      onMouseEnter={mouseenter}
      onMouseLeave={mouseleave}
    />
  );
});
