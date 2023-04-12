import { AnimatePresence, domMax, LazyMotion, m } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "react-hot-toast";

import { DayjsProvider } from "@/utils/dayjs";

import { NextPageWithLayout } from "../../types";
import ModalProvider from "../modal/modal-provider";
import { UserProvider } from "../user-provider";
import { MobileNavigation } from "./standard-layout/mobile-navigation";

const Feedback = dynamic(() => import("../feedback"), { ssr: false });

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION
  ? process.env.NEXT_PUBLIC_APP_VERSION
  : null;

const AppVersion = () => {
  if (!appVersion) return null;

  return (
    <Link
      href="https://github.com/lukevella/rallly/releases"
      className="fixed bottom-2 left-2 hidden p-1 text-xs tabular-nums text-slate-400 lg:block"
    >
      {appVersion}
    </Link>
  );
};

function GlobalProviders(props: React.PropsWithChildren) {
  return (
    <LazyMotion features={domMax}>
      <Toaster />
      <UserProvider>
        <DayjsProvider>
          <ModalProvider>{props.children}</ModalProvider>
        </DayjsProvider>
      </UserProvider>
    </LazyMotion>
  );
}

const StandardLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children, ...rest }) => {
  const router = useRouter();
  return (
    <GlobalProviders>
      <div className="mx-auto min-h-full max-w-5xl lg:p-4 xl:py-8" {...rest}>
        {process.env.NEXT_PUBLIC_FEEDBACK_EMAIL ? <Feedback /> : null}
        <MobileNavigation />
        <AnimatePresence initial={false} exitBeforeEnter={true}>
          <m.div
            key={router.pathname.split("/")[1]}
            transition={{ duration: 0.1, type: "spring" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {children}
          </m.div>
        </AnimatePresence>
        <AppVersion />
      </div>
    </GlobalProviders>
  );
};

export default StandardLayout;

export const getStandardLayout: NextPageWithLayout["getLayout"] =
  function getLayout(page) {
    return <StandardLayout>{page}</StandardLayout>;
  };
