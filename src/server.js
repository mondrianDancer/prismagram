import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import "../src/utils";
import "./passport";
import { authenticateJWT } from "./passport";

//import {sendSecretMail} from "./utils";

// 메일이 잘가는지 확인 (도착메일)
//sendSecretMail("paul619@naver.com", "123")

// process.env.PORT를 읽어서 PORT 변수에 추가하며, 없으면 4000을 넣음
// env에 모든 설정값을 추가하는것은 좋은 습관임
const PORT = process.env.PORT || 4000;

//server에서는 typeDefs, resolvers를 따로 입력하거나
//하나로 합쳐진 schema를 입력하면됨 --> schema를 이용

/*
const typeDefs = `
    type Query{
        hello: String!
    }
`;
const resolvers = {
    Query:{
        hello: () => "hi"
    }
};
const server = new GraphQLServer({typeDefs, resolvers})
*/

//서버만들기 (GraphQLServer에는 express서버가 내장되어 있음)
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request }),
});

server.express.use(logger("dev"));
server.express.use(authenticateJWT);

server.start({ port: PORT }, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
