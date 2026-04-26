import {
  generateColorByUserName,
  getTextColorByBackgroundColor,
} from "../lib/color";

const SQUIRCLE_PATH =
  "M25 0C43 0 50 7 50 25 50 43 43 50 25 50 7 50 0 43 0 25 0 7 7 0 25 0Z";

interface Props {
  username: string;
  interactive?: boolean;
}

export function ProfileAvatar({ username, interactive = false }: Props) {
  const fill = generateColorByUserName(username);
  const textColor = getTextColorByBackgroundColor(fill);
  const initials = username.slice(0, 3).toUpperCase();

  return (
    <div class="w-[50px] m-[5px] flex-shrink-0">
      <svg viewBox="0 0 50 50">
        <path
          d={SQUIRCLE_PATH}
          fill={fill}
          class={
            interactive
              ? "transition-opacity group-hover:opacity-80 group-focus:opacity-80"
              : ""
          }
        />
        <text
          x="50%"
          y="50%"
          dy="5"
          text-anchor="middle"
          fill={textColor}
          font-size="14"
          font-weight="600"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}

export function ProfileAvatarPlaceholder() {
  return <div class="w-[50px] m-[5px] flex-shrink-0" />;
}
