export class Encuesta {
    private preguntas: string[] = ["Pregunta 1", "Pregunta 2", "Pregunta 3", "Pregunta 4"];
    private valores: number[] = [0, 0, 0, 0];

    constructor() {}

    getDataGrafica() {
        return [{
            data: this.valores,
            label: 'Series A'
        }]
    }

    incrementarValor(pregunta: string, valor: number) {

        for(let i in this.preguntas) {
            if (this.preguntas[i] === pregunta) {
                this.valores[i] += valor;
            }
        }

        return this.getDataGrafica();
    }
}