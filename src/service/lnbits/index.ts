import axios from "axios";
import { ApiWallet } from "../../types";
import { Debugger } from "debug";
import { logger } from "../../helpers";

const error: Debugger = logger.extend("error");

const getLNbitsInfo = async (): Promise<ApiWallet | undefined> => {
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
      error.extend("AXIOS ERROR")(err);
    } else {
      error.extend("UNEXPECTED ERROR")(err);
    }
    return undefined;
  }
};

export default getLNbitsInfo;
