import "websocket-polyfill";
import NDK, { NDKRelaySet } from "@nostr-dev-kit/ndk";
import { logger } from "../../helpers";
import { Client } from "discord.js";
import updateTicker from "../discord/ticker";

const log = logger.extend("nostr");
const error = log.extend("error");
const relays = process.env.RELAYS.split(",");
const ndk = new NDK();

const subscribe = async (client: Client) => {
  try {
    await ndk.connect();

    const filter = {
      kinds: [31111],
      authors: [process.env.LEDGER_PUBKEY],
      "#d": [`balance:BTC:${process.env.LAWALLET_PUBKEY}`],
    };

    const event = await ndk.fetchEvent(
      filter,
      { closeOnEose: false },
      NDKRelaySet.fromRelayUrls(relays, ndk, true)
    );

    if (event) {
      const amount = event.tags.find((tag) => tag[0] === "amount");
      client.laWallet = amount
        ? { balance: parseInt(amount[1]), name: "pozo" }
        : undefined;
      updateTicker(client).catch(error);
    }
  } catch (err) {
    error(err);
  }
};

export default subscribe;
