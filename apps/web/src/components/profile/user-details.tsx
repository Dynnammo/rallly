import { trpc } from "@rallly/backend";
import { m } from "framer-motion";
import { useTranslation } from "next-i18next";
import * as React from "react";
import { useForm } from "react-hook-form";

import { useUser } from "@/components/user-provider";
import { usePostHog } from "@/utils/posthog";

import { requiredString, validEmail } from "../../utils/form-validation";
import { Button } from "../button";
import { TextInput } from "../text-input";

export interface UserDetailsProps {
  userId: string;
  name?: string;
  email?: string;
}

export const UserDetails: React.FunctionComponent<UserDetailsProps> = ({
  userId,
  name,
  email,
}) => {
  const { t } = useTranslation();
  const { register, formState, handleSubmit, reset } = useForm<{
    name: string;
    email: string;
  }>({
    defaultValues: { name, email },
  });
  const { refresh } = useUser();

  const posthog = usePostHog();

  const changeName = trpc.user.changeName.useMutation({
    onSuccess: (_, { name }) => {
      reset({ name, email });
      refresh();
      posthog?.people.set({ name });
    },
  });

  const { dirtyFields } = formState;
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (dirtyFields.name) {
          await changeName.mutateAsync({ userId, name: data.name });
        }
      })}
    >
      <div className="space-y-4">
        <div>
          <h2>{t("profile")}</h2>
          <p>Manage your user profile</p>
        </div>
        <h3>{t("myDetails")}</h3>
        <div className="">
          <label htmlFor="name" className="mb-1 w-1/3 text-slate-500">
            {t("name")}
          </label>
          <div className="">
            <TextInput
              id="name"
              className="input w-full"
              placeholder="Jessie"
              readOnly={formState.isSubmitting}
              error={!!formState.errors.name}
              {...register("name", {
                validate: requiredString,
              })}
            />
            {formState.errors.name ? (
              <div className="mt-1 text-sm text-rose-500">
                {t("requiredNameError")}
              </div>
            ) : null}
          </div>
        </div>
        <div className="">
          <label htmlFor="random-8904" className="mb-1 w-1/3 text-slate-500">
            {t("email")}
          </label>
          <div className="">
            <TextInput
              id="random-8904"
              className="input w-full"
              placeholder="jessie.jackson@example.com"
              disabled={true}
              {...register("email", { validate: validEmail })}
            />
          </div>
        </div>
        <div className="flex">
          <Button
            htmlType="submit"
            disabled={!formState.isDirty}
            loading={formState.isSubmitting}
            type="primary"
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </form>
  );
};
