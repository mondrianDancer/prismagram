import { generateSecret, sendSecretMail } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    requestSecret: async (_, args, { request }) => {
      console.log("*************" + request.user);
      const { email } = args;
      console.log("************* { email }: " + { email });
      const loginSecret = generateSecret();
      console.log(loginSecret);
      try {
        throw Error();
        await sendSecretMail(email, loginSecret);
        await prisma.updateUser({ data: { loginSecret }, where: { email } });
        return true;
      } catch {
        return false;
      }
    },
  },
};
