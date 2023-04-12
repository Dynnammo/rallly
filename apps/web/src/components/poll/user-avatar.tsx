import clsx from "clsx";
import { useTranslation } from "next-i18next";
import * as React from "react";

import Badge from "../badge";

export interface UserAvaterProps {
  name: string;
  className?: string;
  size?: "default" | "large";
  color?: string;
  showName?: boolean;
  isYou?: boolean;
}

type RGBColor = [number, number, number];

const avatarBackgroundColors: RGBColor[] = [
  [255, 135, 160],
  [255, 179, 71],
  [255, 95, 95],
  [240, 128, 128],
  [255, 160, 122],
  [255, 192, 203],
  [230, 230, 250],
  [173, 216, 230],
  [176, 224, 230],
  [135, 206, 235],
  [135, 206, 250],
  [106, 90, 205],
  [123, 104, 238],
  [147, 112, 219],
  [138, 43, 226],
  [148, 0, 211],
  [153, 50, 204],
  [139, 0, 139],
  [75, 0, 130],
  [72, 61, 139],
];

const UserAvatar: React.FunctionComponent<UserAvaterProps> = ({
  showName,
  isYou,
  className,
  ...forwardedProps
}) => {
  const { t } = useTranslation();
  if (!showName) {
    return <ColoredAvatar className={className} name={forwardedProps.name} />;
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center space-x-2 overflow-hidden",
        className,
      )}
    >
      <span>
        <ColoredAvatar name={forwardedProps.name} />
      </span>
      <span className="min-w-0 truncate font-medium">
        {forwardedProps.name}
      </span>
      {isYou ? <Badge>{t("you")}</Badge> : null}
    </span>
  );
};

export default UserAvatar;

export const AvatarColorContext = React.createContext<{
  seed: string;
} | null>(null);

export const getRandomAvatarColor = (str: string) => {
  const strSum = str.split("").reduce((acc, val) => acc + val.charCodeAt(0), 0);
  const randomIndex = strSum % avatarBackgroundColors.length;
  return avatarBackgroundColors[randomIndex];
};

export const useAvatarColor = (name: string) => {
  const context = React.useContext(AvatarColorContext);
  return getRandomAvatarColor(context?.seed + name);
};

function requiresWhiteOrDarkText(color: RGBColor) {
  const [r, g, b] = color;
  const L = (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;
  return L > 0.5 ? "dark" : "white";
}

export const ColoredAvatar = (props: { name: string; className?: string }) => {
  const color = useAvatarColor(props.name);
  const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  return (
    <Avatar
      className={clsx(
        requiresWhiteOrDarkText(color) === "dark"
          ? "text-slate-800"
          : "text-white",
        props.className,
      )}
      style={{ backgroundColor: rgbColor }}
    >
      {props.name[0]}
    </Avatar>
  );
};

export const Avatar = (props: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <span
      className={clsx(
        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold uppercase",
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </span>
  );
};

export const You = () => {
  const { t } = useTranslation("app");
  return (
    <span className="inline-flex items-center gap-2">
      <span>
        <Avatar className="bg-slate-400 text-white">{t("you")[0]}</Avatar>
      </span>
      <span>{t("you")}</span>
    </span>
  );
};
