import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router";

import { formatMessageTime } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { MessageSkeleton } from "./components";
import { Logo } from "../../components/svg";

function Index() {
  const { authUser } = useAuthStore();
  const { getUserData } = useChatStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("all");
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    getUserData().then((data) => {
      setData(data);
      setLoading(false);

      const usersSet = new Set();
      data.forEach(([sender, receiver]) => {
        if (sender._id !== authUser._id) usersSet.add(JSON.stringify(sender));
        if (receiver._id !== authUser._id)
          usersSet.add(JSON.stringify(receiver));
      });

      setUniqueUsers([...usersSet].map((u) => JSON.parse(u)));
    });
  }, []);

  useLayoutEffect(() => {
    if (messageContainerRef.current) {
      const messageHeight = 70; // yaklaşık her mesaj kutusunun yüksekliği
      const containerHeight = messageContainerRef.current.offsetHeight;
      const perPage = Math.floor(containerHeight / messageHeight);
      setItemsPerPage(perPage);
    }
  }, [messageContainerRef.current]);

  const exportPDF = () => {
    if (loading) return;

    const formattedHeader = `Hesap Adı: ${authUser?.fullName}\nMail: ${authUser?.email}\nToplam Mesajlar: ${data.length}\nArkadaşlar: ${authUser?.friends.length}\nEngelli Kişiler: ${authUser?.blockedUsers.length}\n\n`;
    const formattedText = filteredData
      .map((group) => {
        const sender = group[0];
        const receiver = group[1];
        const message = group[2];
        return `[${formatMessageTime(message.createdAt)}] ${
          sender.fullName
        } -> ${receiver.fullName}: ${message.text}`;
      })
      .join("\n");

    const blob = new Blob([formattedHeader, formattedText], {
      type: "text/plain",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "talkie-hesap-bilgisi.txt";
    link.click();
  };

  const filteredData = data.filter(([sender, receiver]) => {
    if (selectedUser === "all") return true;
    return sender._id === selectedUser || receiver._id === selectedUser;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="h-dvh flex flex-col bg-base-100">
      <div className="p-4 flex justify-between items-center">
        <Link to={"/"} replace>
          <Logo />
        </Link>
        <h1 className="text-3xl font-bold">Veri İsteme Talebi</h1>
        <div className="space-x-2">
          <button onClick={exportPDF} className="btn btn-success">
            Verileri İndir
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex justify-center mt-6">
          <div className="bg-base-200 rounded-xl p-4 flex items-center gap-4 w-[1100px]">
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full"
            />
            <div className="flex flex-col justify-center gap-1">
              <div className="font-bold text-base">Hesap Adı</div>
              <div className="text-sm">{authUser?.fullName}</div>
              <div className="font-bold text-base mt-2">E-posta</div>
              <div className="text-sm">{authUser?.email}</div>
            </div>
            <div className="flex flex-col justify-center items-start ml-auto gap-1">
              <div className="text-sm font-medium">
                Arkadaşlar: {authUser?.friends.length}
              </div>
              <div className="text-sm font-medium">
                Engellenenler: {authUser?.blockedUsers.length}
              </div>
              <div className="text-sm font-medium">Mesajlar: {data.length}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-center mt-6">
          <div className="bg-base-200 rounded-xl p-5 w-[1100px] max-h-[calc(100vh-100vh*0.4)] flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mesajlar</h2>
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setCurrentPage(1);
                }}
                className="select outline-none!"
              >
                <option value="all">Tüm Kişiler</option>
                {uniqueUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div
              id="messageSection"
              className="space-y-2 flex-grow overflow-hidden"
              ref={messageContainerRef}
            >
              {loading ? (
                <MessageSkeleton />
              ) : paginatedData.length > 0 ? (
                paginatedData.map(([sender, receiver, message]) => (
                  <div
                    key={message._id}
                    className="text-sm w-full p-3 rounded-md bg-base-100 shadow-sm flex items-start"
                    style={{
                      width: "100%",
                      minHeight: "60px",
                      whiteSpace: "pre-line",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                  >
                    [{formatMessageTime(message.createdAt)}] {sender.fullName} →{" "}
                    {receiver.fullName}: {message.text}
                  </div>
                ))
              ) : (
                <p>Mesaj bulunamadı</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`btn btn-sm ${
                      currentPage === idx + 1 ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
