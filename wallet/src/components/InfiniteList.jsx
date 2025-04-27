import React, { useState, useEffect, useRef, useCallback } from 'react';

const InfiniteListIO = ({ renderItem, callback }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const fetchData = useCallback(
    async pageNum => {
      setLoading(true);
      const newItems = await callback(pageNum);
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
    },
    [callback]
  );

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { rootMargin: '100px' }
    );

    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading]);

  return (
    <div>
      <div>{items.map(item => renderItem(item))}</div>
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p style={{ textAlign: 'center' }}>加载中...</p>}
    </div>
  );
};

export default InfiniteListIO;
