import { useState, useEffect } from "react";
import { Device, DeviceEvent, Service } from "miot";
export default function useDeviceIcon() {
  let url = Device.iconURL;
  const index = url.indexOf("?");
  if (index > -1) {
    url = url.slice(0, index);
  }
  const [iconURL, setIconURL] = useState(url);
  useEffect(() => {
    if (Device.extraObj?.split?.parentId) {
      Service.smarthome
        .getDeviceIcon({ subclass_id: 0 })
        .then(({ data: { proxy_category_icon } }) => {
          setIconURL(`${ proxy_category_icon }?${ Date.now() }`);
        });
    }
    const listener = DeviceEvent.deviceIconChanged.addListener(() => {
      if (!Device.extraObj?.split?.parentId) {
        setIconURL(Device.iconURL);
      }
    });
    return () => {
      listener && listener.remove && listener.remove();
    };
  }, []);
  return iconURL;
}