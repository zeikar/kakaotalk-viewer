interface Props {
  text: string;
}

export function NotificationRow({ text }: Props) {
  return (
    <div class="flex justify-center py-4">
      <div class="bg-kakao-timestamp text-white text-sm rounded-full px-3 py-1.5">
        {text}
      </div>
    </div>
  );
}
