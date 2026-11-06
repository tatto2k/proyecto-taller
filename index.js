//Dependencies
const express = require('express');
const morgan = require('morgan');
const app = express();
//Routes
const user = require('./routes/user');
const empleados = require('./routes/empleados');
//Middleware
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const cors = require('./middleware/cors');

app.use(cors);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", index);
app.use("/user", user);

// Todo lo que esté debajo de esta línea requiere token
app.use(auth);
app.use("/empleados", empleados);

app.use(notFound);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});