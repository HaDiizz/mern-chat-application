import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Alert = ({ msg }) => {
  useEffect(() => {
    if (msg.statusErr) {
        toast.error(`${msg.msg}`, {
        });
      }
      if (msg.statusSucc) {
        toast.success(`${msg.msg}`, {
        });
      }
  }, [msg.msg]);

  return <Toaster />
};

export default Alert;
