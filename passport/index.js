const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((data, done) => {
    // data : {user: exUser, accessToken : accessToken} -> 세션에 저장
    console.log(data.user, "에러 수정용");
    done(null, { id: data.user.id, accessToken: data.accessToken }); // 단순히 req.session에 저장되는 값. req.login의 (user) 인수랑 다름
  });
  passport.deserializeUser((user, done) => {
    const id = user.id;
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        },
      ],
    })
      .then((result) => {
        console.log(
          result,
          `\n`,
          "--------------------result------------------"
        );
        done(null, { user: result, accessToken: user.accessToken }); // req.user에 저장되는 값? 형태는?
      })
      .catch((err) => done(err));
  });

  local();
  kakao();
};
