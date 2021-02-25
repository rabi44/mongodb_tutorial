console.log("client code running...");
const axios = require("axios");

/*
blog의 comment 및 user object로 모두 표시
1. 비효율적인 방법 (client에서 db에 집접 접근, 아래 주석)
blog 20, comment 20: 4초 대
blog 50, comment 20: 8초 대

2. 서버 단에서 cleint 에서 호출한 코드 그대로 서버에서 실행

3. 서버 단에서 populate 사용
blog 20, comment 20: 700ms 대
blog 50, comment 20: 900ms 대

4. neting 사용하는 방법
blog 20, comment 20: 100ms 대
blog 50, comment 20: 200ms 대

/** */

const URI = "http://localhost:3000";
const test = async () => {
  console.time("loading time: ");
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);
  // blogs = await Promise.all(
  //   blogs.map(async (blog) => {
  //     const [res1, res2] = await Promise.all([
  //       axios.get(`${URI}/user/${blog.user}`),
  //       axios.get(`${URI}/blog/${blog._id}/comment`),
  //     ]);
  //     blog.user = res1.data.user;
  //     blog.comments = await Promise.all(
  //       res2.data.comments.map(async (comment) => {
  //         const {
  //           data: { user },
  //         } = await axios.get(`${URI}/user/${comment.user}`);
  //         comment.user = user;
  //         return comment;
  //       })
  //     );
  //     return blog;
  //   })
  // );

  //console.dir(blogs[0], { depth: 10 });
  console.timeEnd("loading time: ");
};

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
