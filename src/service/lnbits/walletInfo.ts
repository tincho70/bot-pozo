import axios from "axios";
import { ApiWallet } from "../../types";
import { Debugger } from "debug";
import { logger } from "../../helpers";

const error: Debugger = logger.extend("error");

const getWalletInfo = async (): Promise<ApiWallet | undefined> => {
  try {
    const { data } = await axios.get("https://demo.lnbits.com/api/v1/wallet", {
      headers: {
        Accept: "application/json",
        "X-Api-Key": process.env.INVOICE_READ_KEY,
      },
    });
    return data as ApiWallet;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.extend("AXIOS ERROR").log(err);
    } else {
      error.extend("UNEXPECTED ERROR").log(err);
    }
    return undefined;
  }
};

export default getWalletInfo;
