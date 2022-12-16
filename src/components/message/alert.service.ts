export const AlertType = {
  Success: 'success',
  Error: 'error',
  Info: 'info',
  Warning: 'warning',
};

type Alert = {
  id: string;
  itemId: string | number;
  type: string;
  message: string;
  autoClose?: boolean;
  keepAfterRouteChange?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  [key: string]: string | number | boolean | undefined;
};
export type { Alert };

const alertSubject = {
  id: null,
  observers: [] as any[],
  subscribe(ob: any) {
    this.observers.push(ob);
    return this.unsubscribe;
  },
  next(alert: Partial<Alert>) {
    this.observers
      .filter(() => alert && alert.id === this.id)
      .forEach((observer: any) => observer(alert));
  },
  setId(id: any) {
    this.id = id;
  },
  unsubscribe() {
    this.observers = [];
  },
};
const defaultId = 'default-alert';

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
  alertSubject.setId(id);
  return alertSubject;
}

// core alert method
function alert(alert: Alert) {
  alert.id = alert.id || defaultId;
  alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
  alert.keepAfterRouteChange = true;
  alertSubject.next(alert);
}

// convenience methods
function success(message: string, options?: any) {
  alert({ ...options, type: AlertType.Success, message });
}

function error(message: string, options?: any) {
  alert({ ...options, type: AlertType.Error, message });
}

function info(message: string, options?: any) {
  alert({ ...options, type: AlertType.Info, message });
}

function warn(message: string, options?: any) {
  alert({ ...options, type: AlertType.Warning, message });
}

// clear alerts
function clear(id = defaultId) {
  alertSubject.next({ id });
}

export const alertService = {
  onAlert,
  success,
  error,
  info,
  warn,
  alert,
  clear,
};

export default alertService;
