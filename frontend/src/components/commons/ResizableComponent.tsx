import { useState, useRef, useEffect, ReactNode } from "react";
interface ResizableComponentProps {
  builder: (arg: { width: number; height: number }) => ReactNode;
}
const ResizableComponent = ({ builder }: ResizableComponentProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        setWidth(parentRef.current.offsetWidth);
        setHeight(parentRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return <div ref={parentRef}>{builder({ height, width })}</div>;
};

export default ResizableComponent;
