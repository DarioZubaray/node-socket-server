import {Router, Request, Response} from 'express';
import Server  from '../classes/Server';
import { usuariosConectados } from '../sockets/sockets';
import { GraficaData } from '../classes/Grafica';
import { Encuesta } from '../classes/Encuesta';
import { Mapa } from '../classes/Mapa';

const router = Router();

export const mapa = new Mapa();
const lugares = [
    {
        id: '1', nombre: 'Udemy', lat: 37.784679, lng: -122.395936
    },
    {
        id: '2', nombre: 'Bahía de San Francisco', lat: 37.798933, lng: -122.377732
    },
    {
        id: '3', nombre: 'The Palace Hotel', lat: 37.788578, lng: -122.401745
    }
  ];
mapa.marcadores.push(...lugares);
router.get('/mapa', (req: Request, res: Response) => {
    res.json(mapa.getMarcadores());
});

const grafica = new GraficaData();
router.get('/grafica', (req: Request, res: Response) => {
    res.json(grafica.getDataGrafica());
});
router.post('/grafica', (req: Request, res: Response) => {
    const mes = req.body.mes;
    const valor = Number(req.body.valor);

    grafica.incrementarValor(mes, valor);
    //cambio-grafica
    const server = Server.instance;
    server.io.emit('cambio-grafica', grafica.getDataGrafica());

    res.json(grafica.getDataGrafica());
});

const encuesta = new Encuesta();
router.get('/encuesta', (req: Request, res: Response) => {
    res.json(encuesta.getDataGrafica());
});
router.post('/encuesta', (req: Request, res: Response) => {
    const pregunta = req.body.pregunta;
    const valor = Number(req.body.valor);

    encuesta.incrementarValor(pregunta, valor);
    //cambio-encuesta
    const server = Server.instance;
    server.io.emit('cambio-encuesta', encuesta.getDataGrafica());

    res.json(encuesta.getDataGrafica());
});

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({ok: true, mensaje: 'Todo está bien'});
});

router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const server = Server.instance;
    const payload = {
        de,
        cuerpo
    }
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true, 
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const id = req.params.id;

    const server = Server.instance;
    const payload = {
        de,
        cuerpo
    }
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true, 
        cuerpo,
        de,
        id
    });
});

router.get('usuario', (req: Request, res: Response) => {
    const server = Server.instance;
    server.io.clients( (err: any, clientes: string[]) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            clientes
        });
    });
});

router.get('usuarios/detalle', (req: Request, res: Response) => {
    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });
});

export default router;