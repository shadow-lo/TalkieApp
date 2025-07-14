import { useEffect, useState, useCallback } from "react";
import BlockedUserItem from "./BlockedUserItem";
import { useAuthStore } from "../../store/useAuthStore";

function BlockedUsers() {
  const {
    getBlockedUsers,
    blockedUsers,
    unblockFriend,
    subscribeToFriends,
    unsubscribeFromFriends,
  } = useAuthStore();
  // const [loading, setLoading] = useState(true);
  const [respond, setRespond] = useState(false);

  // useEffect(() => {
  //   // const fetchRequests = async () => {
  //   //   try {
  //   //     await getBlockedUsers();
  //   //   } catch (error) {
  //   //     console.error("Error fetching friend requests:", error);
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // };
  //   // fetchRequests();
  //   subscribeToFriends();

  //   return () => unsubscribeFromFriends();
  // }, [subscribeToFriends, unsubscribeFromFriends]);

  const handleResponse = useCallback(
    async (userId) => {
      try {
        setRespond(true);
        await unblockFriend(userId);
        await getBlockedUsers(); // Güncellenmiş veriyi çek
      } catch (error) {
        console.error("Error handling request:", error);
      } finally {
        setRespond(false);
      }
    },
    [unblockFriend, getBlockedUsers]
  );

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <h2 className="text-2xl">Engellenen Kullanıcılar</h2>
      {blockedUsers.length === 0 ? (
        <p className="text-gray-500">Hiç bir kullanıcıyı engellememişsin.</p>
      ) : (
        blockedUsers.map((user) => (
          <BlockedUserItem
            key={user._id}
            user={user}
            onRespond={handleResponse}
            loading={respond}
          />
        ))
      )}
    </div>
  );
}

export default BlockedUsers;
