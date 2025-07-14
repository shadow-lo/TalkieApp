import { NoChatSvg } from "../../../components/svg";

function NoChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-16 rounded-box">
      <div className="flex flex-col items-center text-center space-y-3">
        <NoChatSvg className="size-[clamp(16rem,25vw,36rem)]" />

        <div>
          <h2 className="text-4xl max-lg:text-3xl font-bold">
            Talkie'ye hoş geldin!
          </h2>
          <p className="text-base-content/60 font-light">
            Bir arkadaşını seç ve konuşmaya başla.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoChat;
