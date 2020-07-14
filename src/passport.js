import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

// 토큰 받기 -> 해석하기 -> 사용자 찾기
// -> 사용자가 존재한다면 req 객체에 사용자를 추가 -> graphql 함수실행
// 만약 로그인 되어 있다면 모든 graphql 요청에 사용자 정보가 추가되어서 요청

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

const verifyUser = async (_, payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (err) {
      console.err("에러났어");
      return done(err, false);
    }
    if (user) {
      req.user = user;
      console.log("나와라 얍: " + user);
      done(null, user);
    } else {
      console.log("유저가 없어..");
      done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

export const authenticateJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
