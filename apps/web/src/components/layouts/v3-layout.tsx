import { LoginIcon, SpinnerIcon, UserCircleIcon } from "@rallly/icons";
import clsx from "clsx";
import { domMax, LazyMotion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";
import { Toaster } from "react-hot-toast";

import { useUser } from "@/components/user-provider";
import { DayjsProvider } from "@/utils/dayjs";

import { NextPageWithLayout } from "../../types";
import ModalProvider from "../modal/modal-provider";
import { UserProvider } from "../user-provider";

export const Navigation = (props: { className?: string }) => {
  const { user } = useUser();
  const { t } = useTranslation();

  const router = useRouter();

  const [isBusy, setIsBusy] = React.useState(false);

  React.useEffect(() => {
    const setBusy = () => setIsBusy(true);
    const setNotBusy = () => setIsBusy(false);
    router.events.on("routeChangeStart", setBusy);
    router.events.on("routeChangeComplete", setNotBusy);
    return () => {
      router.events.off("routeChangeStart", setBusy);
      router.events.off("routeChangeComplete", setNotBusy);
    };
  }, [router.events]);
  return (
    <div
      className={clsx(
        "mb-8 flex w-full shrink-0 items-center justify-between",
        props.className,
      )}
    >
      <div className="flex items-center">
        <div className="flex items-center gap-4 px-2">
          <Link
            href="/polls"
            className="transition-all hover:opacity-75 active:translate-y-1"
          >
            <Image src="/logo.svg" height={32} width={100} alt="rallly.co" />
          </Link>
          {isBusy ? (
            <SpinnerIcon className="h-4 animate-spin text-slate-500" />
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {user.isGuest ? (
          <Link href="/login" className="btn-default gap-2">
            <LoginIcon className="h-5" />
            {t("login")}
          </Link>
        ) : null}
        <Link href="/profile" className="btn-default gap-2">
          <UserCircleIcon className="h-5" />
          {user.isGuest ? t("guest") : user.shortName}
        </Link>
      </div>
    </div>
  );
};

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
        <Navigation />
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
