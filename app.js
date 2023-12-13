require("dotenv/config");
require("./db");
const express = require("express");

const app = express();

require("./config")(app);

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const partnerRouter = require("./routes/partners.routes");
app.use("/api", partnerRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api", taskRouter);

const authRoutes = require("./routes/sales.routes");
app.use("/", authRoutes);

const logRoutes = require("./routes/logOfficer.routes");
app.use("/", logRoutes);

const auth = require("./routes/auth.routes");
app.use("/", auth);


require("./error-handling")(app);

module.exports = app;
