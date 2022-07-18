import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export const alertService = {
  onAlert,
  success,
  error,
  info,
  warn,
  alert,
  clear,
};

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
};
export type { Alert };

export default alertService;

const alertSubject = new Subject();
const defaultId = 'default-alert';

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
  return alertSubject.asObservable().pipe(filter((x: any) => x && x.id === id));
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

// core alert method
function alert(alert: Alert) {
  alert.id = alert.id || defaultId;
  alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
  alert.keepAfterRouteChange = true;
  alertSubject.next(alert);
}

// clear alerts
function clear(id = defaultId) {
  alertSubject.next({ id });
}
