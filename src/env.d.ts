declare global {
  interface Window {
    __buttonActionListenerAttached?: boolean;
    __buttonActionAlertAttached?: boolean;
  }
}

export {};
