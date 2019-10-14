import { Socket } from 'socket.io';
import SocketIO from 'socket.io';
import { UsuariosLista } from '../classes/Usuarios-lista';
import { Usuario } from '../classes/Usuario';

export const usuariosConectados = new UsuariosLista();

export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario(cliente.id);
        console.log('Cliente desconectado.');
    });
};

export const mensaje = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string}) => {
        console.log(`Mensaje recibido '${payload.cuerpo}' de ${payload.de}`);

        io.emit('mensaje-nuevo', payload);
    });
};

export const configurarUsuario = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {
        console.log(`Configurando usuario ${payload.nombre}`);

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        callback({
            ok: true,
            mensaje: `usuario ${payload.nombre} configurado`
        })
    });
};

export const conectarCliente = (cliente: Socket) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
};