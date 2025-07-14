import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../../../lib/utils";

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    setSelectedUser,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, friends } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    // subscribeToMessages();

    // return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    // subscribeToMessages,
    // unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  useEffect(() => {
    // if (!friends.some((friend) => friend._id === selectedUser._id)) {
    //   setSelectedUser(null);
    // }
    if (!friends.includes(selectedUser._id)) {
      setSelectedUser(null);
    }
  }, [friends]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto rounded-box">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full rounded-box">
      <ChatHeader />

      <div className="h-full overflow-y-auto px-3 pt-3 space-y-3 font-thin">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border-base-300 border-1">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profil"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-80 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`max-w-5xl max-2xl:max-w-full chat-bubble break-words ${
                message.senderId === authUser._id
                  ? "bg-base-200 text-base-content"
                  : "bg-neutral text-neutral-content"
              } flex flex-col`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <ChatInput />
    </div>
  );
}

export default ChatContainer;
