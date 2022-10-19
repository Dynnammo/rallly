import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useMount } from "react-use";

import X from "@/components/icons/x.svg";

import { Button, ButtonProps } from "../button";
import CompactButton from "../compact-button";

export interface ModalProps {
  description?: React.ReactNode;
  title?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "auto";
  okButtonProps?: ButtonProps;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  footer?: React.ReactNode;
  content?: React.ReactNode;
  overlayClosable?: boolean;
  visible?: boolean;
  showClose?: boolean;
}

const Modal: React.VoidFunctionComponent<ModalProps> = ({
  description,
  title,
  okText,
  cancelText,
  okButtonProps,
  footer,
  content,
  overlayClosable,
  size = "auto",
  onCancel,
  onOk,
  visible,
  showClose,
}) => {
  const initialFocusRef = React.useRef<HTMLElement>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useMount(() => {
    if (modalRef.current) {
      const el =
        modalRef.current.querySelector<HTMLElement>("[data-autofocus]");
      if (el) {
        el.focus();
      }
    }
  });

  const [loading, setLoading] = React.useState(false);
  return (
    <AnimatePresence>
      {visible ? (
        <Dialog
          open={visible}
          className="fixed inset-0 z-40 overflow-y-auto"
          initialFocus={initialFocusRef}
          onClose={() => {
            if (overlayClosable) onCancel?.();
          }}
        >
          <motion.div
            transition={{ duration: 0.5 }}
            className="flex min-h-screen items-center justify-center"
          >
            <Dialog.Overlay
              as={motion.div}
              transition={{ duration: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 bg-slate-900 bg-opacity-5"
            />
            <motion.div
              transition={{ duration: 0.1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-50 my-8 inline-block max-w-full transform text-left align-middle"
            >
              <div
                ref={modalRef}
                className={clsx(
                  "max-w-full overflow-hidden rounded-md bg-white shadow-xl",
                  {
                    "w-fit": size === "auto",
                    "w-[300px]": size === "xs",
                    "w-[400px]": size === "sm",
                    "w-[600px]": size === "md",
                    "w-[800px]": size === "lg",
                  },
                )}
              >
                {showClose ? (
                  <CompactButton
                    icon={X}
                    onClick={onCancel}
                    className="absolute right-2 top-2 z-10"
                  />
                ) : null}
                {content ?? (
                  <div className="max-w-md p-6">
                    {title ? (
                      <Dialog.Title className="mb-2 font-medium">
                        {title}
                      </Dialog.Title>
                    ) : null}
                    {description ? (
                      <Dialog.Description className="m-0">
                        {description}
                      </Dialog.Description>
                    ) : null}
                  </div>
                )}
                {footer === undefined ? (
                  <div className="flex h-14 items-center justify-end space-x-3 rounded-br-lg rounded-bl-lg border-t bg-slate-50 px-4">
                    {cancelText ? (
                      <Button
                        onClick={() => {
                          onCancel?.();
                        }}
                      >
                        {cancelText}
                      </Button>
                    ) : null}
                    {okText ? (
                      <Button
                        loading={loading}
                        type="primary"
                        onClick={async () => {
                          setLoading(true);
                          await onOk?.();
                          setLoading(false);
                        }}
                        {...okButtonProps}
                      >
                        {okText}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        </Dialog>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;

export const ModalContent: React.VoidFunctionComponent<{
  children?: React.ReactNode;
  overlayClosable?: boolean;
  visible?: boolean;
  showClose?: boolean;
}> = ({ children, ...forwardProps }) => {
  return <Modal content={children} {...forwardProps} />;
};
