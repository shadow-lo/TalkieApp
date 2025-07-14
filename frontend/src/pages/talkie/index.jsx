import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { ChatContainer, NoChat, Sidebar } from "./components";
import { useAuthStore } from "../../store/useAuthStore";

function TalkiePage() {
  const { selectedUser } = useChatStore();
  const { subscribeToFriends, unsubscribeFromFriends, getRequests } =
    useAuthStore();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        await getRequests();
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    // subscribeToFriends();
    fetchRequests();

    // return () => unsubscribeFromFriends();
  }, [subscribeToFriends, unsubscribeFromFriends]);

  return (
    <div className="w-full h-full lg:p-10 bg-base-200">
      <div className="w-full h-full flex overflow-hidden bg-base-100 rounded-box shadow">
        <Sidebar />
        {selectedUser ? <ChatContainer /> : <NoChat />}
      </div>
    </div>
  );
}

export default TalkiePage;
