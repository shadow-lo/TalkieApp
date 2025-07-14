import { useEffect, useState, useCallback } from "react";
import FriendRequestItem from "./FriendRequestItem";
import { useAuthStore } from "../../store/useAuthStore";

function FriendRequests() {
  const {
    getRequests,
    friendRequests,
    responseRequest,
    subscribeToFriends,
    unsubscribeFromFriends,
  } = useAuthStore();
  // const [loading, setLoading] = useState(true);
  const [respond, setRespond] = useState(false);

  // useEffect(() => {
  //   // const fetchRequests = async () => {
  //   //   try {
  //   //     await getRequests();
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
    async (userId, response) => {
      try {
        setRespond(true);
        await responseRequest(userId, { response });
        await getRequests();
      } catch (error) {
        console.error("Error handling request:", error);
      } finally {
        setRespond(false);
      }
    },
    [responseRequest, getRequests]
  );

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <h2 className="text-2xl">Bekleyen İstekler</h2>
      {friendRequests.length === 0 ? (
        <p className="text-gray-500">Şu anda bekleyen istek yok.</p>
      ) : (
        friendRequests.map((user) => (
          <FriendRequestItem
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

export default FriendRequests;
