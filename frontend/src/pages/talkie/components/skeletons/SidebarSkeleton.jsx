function SidebarSkeleton() {
  const skeletonContacts = Array(8).fill(null);

  return (
    <div className="overflow-y-auto space-y-1 w-full flex-1">
      {skeletonContacts.map((_, idx) => (
        <div
          key={idx}
          className="w-full p-3 lg:px-5 lg:py-3 flex items-center gap-3"
        >
          <div className="relative mx-auto lg:mx-0">
            <div className="skeleton size-12 rounded-full" />
          </div>

          <div className="hidden lg:block text-left min-w-0 flex-1">
            <div className="skeleton h-4 w-32 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SidebarSkeleton;
