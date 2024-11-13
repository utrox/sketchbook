import { useRef, useCallback } from "react";

interface InfiniteScrollProps {
  items: any[];
  loading: boolean;
  ItemComponent: any;
  itemProps: any;
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
      {items.map((item: any, index: number) => (
        <ItemComponent
          key={index}
          {...{ ...itemProps, ...item }}
          innerRef={items.length === index + 1 ? lastPostComponentRef : null}
        />
      ))}
      {loading && loadingComponent}
      {!hasMore && hasNoMoreComponent}
    </>
  );
};

export default InfiniteScroll;
