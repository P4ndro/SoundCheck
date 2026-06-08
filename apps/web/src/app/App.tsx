import { BandWorkspaceProvider } from "@/providers/BandWorkspaceProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function App() {
  return (
    <BandWorkspaceProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </BandWorkspaceProvider>
  );
}
