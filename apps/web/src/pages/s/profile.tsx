import { GuestUserSession, RegisteredUserSession } from "@rallly/backend";
import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { InformationCircleIcon, UserAddIcon } from "@rallly/icons";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import { getProfileLayout } from "@/components/layouts/profile-layout";
import { UserDetails } from "@/components/profile/user-details";
import { useUser } from "@/components/user-provider";

import { NextPageWithLayout } from "../../types";
import { withPageTranslations } from "../../utils/with-page-translations";

const GuestProfile = (props: { user: GuestUserSession }) => {
  const { t } = useTranslation("app");
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2>{t("Guest Session")}</h2>
        <p>
          {t(
            "As a guest, your session is stored in a cookie inside your browser. This means that you can't access your session from another device. If you want to access your session from another device, you can create an account.",
          )}
        </p>
        <div>
          <label>Guest User Id</label>
          <p>{props.user.id}</p>
        </div>
        <div>
          <label>{t("Expiry")}</label>
          <p>Unknown</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href="https://support.rallly.co/guest-sessions"
          className="btn-default gap-2"
        >
          <InformationCircleIcon className="h-5" />{" "}
          {t("Read more about guest sessions")}
        </Link>
        <Link href="/register" className="btn-default gap-2">
          <UserAddIcon className="h-5" />
          {t("createAnAccount")}
        </Link>
      </div>
    </div>
  );
};

const UserProfile = (props: { user: RegisteredUserSession }) => {
  const { user } = props;
  return <UserDetails userId={user.id} name={user.name} email={user.email} />;
};

const Page: NextPageWithLayout = () => {
  const { user } = useUser();
  const { t } = useTranslation("app");

  return (
    <>
      <Head>
        <title>{t("profile")}</title>
      </Head>
      {user.isGuest ? (
        <GuestProfile user={user} />
      ) : (
        <UserProfile user={user} />
      )}
    </>
  );
};

Page.getLayout = getProfileLayout;

export const getServerSideProps = withSessionSsr([
  withAuthIfRequired,
  withPageTranslations(["common", "app"]),
]);

export default Page;
