import { domMax, LazyMotion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
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
      <MotionConfig reducedMotion="always">
        <Toaster />
        <UserProvider>
          <DayjsProvider>
            <ModalProvider>{props.children}</ModalProvider>
          </DayjsProvider>
        </UserProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

const StandardLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children, ...rest }) => {
  return (
    <GlobalProviders>
      <div
        className="mx-auto min-h-full max-w-5xl p-2.5 md:p-4 xl:p-8"
        {...rest}
      >
        {process.env.NEXT_PUBLIC_FEEDBACK_EMAIL ? <Feedback /> : null}
        <MobileNavigation />
        <div>{children}</div>
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
