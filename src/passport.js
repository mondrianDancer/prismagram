import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
  // header에 bearer스키마에 담겨온 토큰 해석할 것
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // .env파일에 있음.
  passReqToCallback: true,
};

console.log(jwtOptions);

// 유저 인증. prisma를 통해 있는지 확인함
const verifyUser = async (_, payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id }); //payload의 id 가 있는 유저인지 확인
    console.log("*************payload: " + user);
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};
// 1. server에서 호출하는 함수
export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    // 콜백함수
    console.log("*************authenticateJWT: " + user);
    if (user) {
      //유저가 있다면 request에 user를 넣어줍니다.
      req.user = user;
    }
    next();
  })(req, res, next);
};

// jwtOptions 기반으로한 Strategy으로 인증하고 성공시  verifyUser호출
passport.use(new Strategy(jwtOptions, verifyUser)); // 2. 만들어놓은 option과 유저확인 함수로 토큰을 인증함.
passport.initialize();
