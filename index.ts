import Server from "./classes/Server";
import { SERVER_PORT } from "./global/environment";
import router from "./routes/router";


const server = new Server();

server.app.use('/', router)

server.start( () => {
    console.log(`Servidor inicializado en el puerto ${SERVER_PORT}`);
})