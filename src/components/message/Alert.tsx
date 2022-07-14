import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import Message from './Message';
import { alertService, AlertType } from './message.service';
export { Alert };

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: 'default-alert',
  fade: true,
};

function Alert({ id, fade }) {
  const mounted = useRef(false);
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    mounted.current = true;

    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          return omit(filteredAlerts, 'keepAfterRouteChange');
        });
      } else {
        // add alert to array with unique id
        alert.itemId = Math.random();
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          // setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const clearAlerts = () => alertService.clear(id);
    router.events.on('routeChangeStart', clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      mounted.current = false;

      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off('routeChangeStart', clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function omit(arr, key) {
    return arr.map((obj) => {
      const { [key]: omitted, ...rest } = obj;
      return rest;
    });
  }

  function removeAlert(alert) {
    if (!mounted.current) return;

    if (fade) {
      // fade out alert
      setAlerts((alerts) =>
        alerts.map((x) =>
          x.itemId === alert.itemId ? { ...x, fade: true } : x
        )
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
    }
  }

  function cssClasses(alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-info'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('transition-opacity');
    }

    return classes.join(' ');
  }

  if (!alerts.length) return null;

  return (
    <div>
      {alerts.map((alert, index) => (
        <Message key={index} type={alert.type} content={alert.message} />
      ))}
    </div>
  );
}
