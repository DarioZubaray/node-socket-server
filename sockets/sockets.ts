import { Socket } from 'socket.io';
import SocketIO from 'socket.io';
import { UsuariosLista } from '../classes/Usuarios-lista';
import { Usuario } from '../classes/Usuario';
import { mapa } from '../routes/router';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
};

export const desconectar = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado.');

        usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos', usuariosConectados.getLista());
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

        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `usuario ${payload.nombre} configurado`
        })
    });
};

export const obtenerUsuario = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('obtener-usuarios', () => {

        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());

    });
};

export const marcadorNuevo = (cliente: Socket) => {
    cliente.on('marcador-nuevo', (marcador) => {
        mapa.agregarMarcador(marcador);
        cliente.broadcast.emit('marcador-nuevo', marcador);
    });
};

export const marcadorBorrar = (cliente: Socket) => {
    cliente.on('marcador-borrar', (id: string) => {
        mapa.borrarMarcador(id);
        cliente.broadcast.emit('marcador-borrar', id);
    })
}

export const marcadorMover = (cliente: Socket) => {
    cliente.on('marcador-mover', (marcador) => {
        mapa.moverMarcador(marcador);
        cliente.broadcast.emit('marcador-mover', marcador);
    })
}