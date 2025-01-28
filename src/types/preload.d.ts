export {};

declare global {
  interface Window {
    electron: {
      initialize: (callback: () => void) => void;
      onNewComment: (callback: (data: { user: string; message: string }) => void) => void;
      onSetChannel: (channelName: string) => Promise<{ success: boolean; message: string }>;
    };
  }
}