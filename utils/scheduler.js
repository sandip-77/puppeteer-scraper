const spawn = require("child_process").spawn;
const schedule = require("node-schedule");

schedule.scheduleJob("* * * * *", () => {
  spawn("node", ["index.js"]);
});
