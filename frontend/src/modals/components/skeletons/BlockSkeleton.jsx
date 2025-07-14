function BlockSkeleton() {
  return (
    <div className="flex items-center justify-center space-x-10">
      <div className="flex items-center space-x-2">
        <div className="skeleton size-12 rounded-full" />
        <h2 className="skeleton w-24 h-4"></h2>
      </div>

      <div className="space-x-2 flex">
        <button className="skeleton w-32 h-10 rounded-box"></button>
      </div>
    </div>
  );
}

export default BlockSkeleton;
