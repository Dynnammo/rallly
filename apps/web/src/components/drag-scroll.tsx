import clsx from "clsx";
import React from "react";

export function DragScroll(
  props: React.PropsWithChildren<{
    className?: string;
    onScroll?: (percent: number) => void;
  }>,
) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const isOverflown = scrollContainerRef.current
    ? scrollContainerRef.current.scrollWidth >
      scrollContainerRef.current.clientWidth
    : false;

  const isMouseDown = React.useRef(false);

  const handleMouseDown: React.MouseEventHandler<HTMLElement> = (event) => {
    if (!scrollContainerRef.current) return;
    isMouseDown.current = true;
    setStartX(event.pageX - scrollContainerRef.current.offsetLeft);
    setStartY(event.pageY - scrollContainerRef.current.offsetTop);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const handleMouseMove: React.MouseEventHandler = (event) => {
    if (!scrollContainerRef.current) return;
    if (!isMouseDown.current) return;
    const x = event.pageX - scrollContainerRef.current.offsetLeft;
    const y = event.pageY - scrollContainerRef.current.offsetTop;
    if (Math.abs(x - startX) > 50) {
      setIsDragging(true);
    }
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp: React.MouseEventHandler = () => {
    isMouseDown.current = false;
    setIsDragging(false);
  };

  const handleMouseLeave: React.MouseEventHandler = () => {
    isMouseDown.current = false;
    setIsDragging(false);
  };

  return (
    <div
      className={clsx(
        "scrollbar-thin overscroll-touch scrollbar-track-gray-100 scrollbar-thumb-gray-300 overflow-auto",
        isOverflown ? (isDragging ? "cursor-grabbing" : "") : "",
        props.className,
      )}
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx(isDragging ? "pointer-events-none" : "")}>
        {props.children}
      </div>
    </div>
  );
}
