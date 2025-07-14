import { RouterProvider } from "react-router";

import { Toaster } from "react-hot-toast";

import { useThemeStore } from "./store/useThemeStore.js";
import { routes } from "./router";
import { useAuthStore } from "./store/useAuthStore.js";
import { useChatStore } from "./store/useChatStore.js";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function App() {
  const { checkAuth, isCheckingAuth, subscribeToFriends } = useAuthStore();
  const { subscribeToMessages } = useChatStore();
  const { theme } = useThemeStore();

  //TODO: login sayfasından talkie sayfasına geçerken checkAuth atmıyor. (user datası bozuluyor.)
  useEffect(() => {
    checkAuth().then((user) => {
      if (user) {
        subscribeToMessages();
        subscribeToFriends();
      }
    });
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div
        data-theme={theme}
        className="flex items-center justify-center h-dvh"
      >
        <Loader2 className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <RouterProvider router={routes} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          success: {
            style: {
              // border: "1px solid var(--color-success-content)",
              color: "var(--color-success-content)",
              backgroundColor: "var(--color-success)",
            },
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "var(--color-success-content)",
            },
          },

          error: {
            style: {
              // border: "1px solid var(--color-success-content)",
              color: "var(--color-error-content)",
              backgroundColor: "var(--color-error)",
            },
            iconTheme: {
              primary: "var(--color-error)",
              secondary: "var(--color-error-content)",
            },
          },
        }}
      />
    </div>
  );
}
