import React from "react";

import StandardLayout from "@/components/layouts/v3-layout";
import { NextPageWithLayout } from "@/types";

export const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="h-full bg-gray-100 p-3 sm:p-8">
      <div className="mx-auto h-full max-w-md items-start justify-center">
        <div className="max-w-full overflow-hidden rounded-md border bg-white shadow-sm">
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const getAuthLayout: NextPageWithLayout["getLayout"] =
  function getLayout(page) {
    return (
      <StandardLayout>
        <AuthLayout>{page}</AuthLayout>
      </StandardLayout>
    );
  };
