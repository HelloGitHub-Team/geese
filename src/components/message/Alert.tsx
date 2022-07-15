import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import Message from './Message';
import { alertService } from './message.service';
export { Alert };

Alert.propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

Alert.defaultProps = {
  id: 'default-alert',
  fade: false,
};

function Alert({ id }) {
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
        alert.fadeIn = true;
        alert.fadeOut = false;
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          removeAlert(alert);
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

  function removeAlert(alert, duration = 1000 * 2) {
    if (!mounted.current) return;
    const remove = () => {
      // 先给待删除的元素加上一个动画
      setAlerts((alerts) =>
        alerts.map((x) =>
          x.itemId === alert.itemId ? { ...x, fadeIn: false, fadeOut: true } : x
        )
      );

      // 延迟删除
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x.itemId !== alert.itemId));
      }, 250);
    };
    if (duration) {
      setTimeout(remove, duration);
    } else {
      remove();
    }
  }

  function cssClasses(alert) {
    if (!alert) return;

    const classes = 'block p-4 text-center'.split(' ');

    if (alert.fadeOut) {
      classes.push('ant-move-up-leave ant-move-up-leave-active');
    } else if (alert.fadeIn) {
      classes.push('ant-move-up-appear ant-move-up-appear-active');
    }

    return classes.join(' ');
  }

  if (!alerts.length) return null;

  return (
    <div className='pointer-events-none fixed top-4 left-0 z-50 w-full'>
      <div>
        {alerts.map((alert, index) => (
          <div key={index} className={cssClasses(alert)}>
            <Message
              type={alert.type}
              content={alert.message}
              onClose={() => removeAlert(alert, 0)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
