import { useRef, useCallback } from "react";
import { Dictionary } from "../types";

interface InfiniteScrollProps {
  items: Dictionary[];
  loading: boolean;
  ItemComponent: JSX.Element;
  itemProps: Dictionary;
  hasMore: boolean;
  loadMoreItems: () => void;
  loadingComponent?: JSX.Element;
  hasNoMoreComponent?: JSX.Element;
  hasNoElementComponent?: JSX.Element;
}

const InfiniteScroll = ({
  items,
  loading,
  ItemComponent,
  itemProps,
  hasMore,
  loadMoreItems,
  loadingComponent,
  hasNoMoreComponent,
  hasNoElementComponent,
}: InfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostComponentRef = useCallback(
    (element: HTMLDivElement) => {
      if (loading) return;

      /* Remove observer from current last element */
      if (observer.current) observer.current.disconnect();
      /* Fetch more data, new items will be rendered */
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      });
      /* Add it to the new last element. */
      if (element) observer.current.observe(element);
    },
    [loading]
  );

  return (
    <>
      {items.length === 0 && hasNoElementComponent}
      {items.map((item: Dictionary, index: number) => (
        <ItemComponent
          key={index}
          {...{ ...itemProps, ...item }}
          ref={items.length === index + 1 ? lastPostComponentRef : undefined}
        />
      ))}
      {loading && loadingComponent}
      {!hasMore && hasNoMoreComponent}
    </>
  );
};

export default InfiniteScroll;
