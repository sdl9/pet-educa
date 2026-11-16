import test from 'node:test';
import assert from 'node:assert/strict';
import { SACI_QUIZ_QUESTIONS as questions } from '../src/game/data/saciQuizQuestions.js';
import { SaciQuizRound, SACI_QUIZ_LETTERS as letters } from '../src/game/systems/SaciQuizRound.js';

const wrongLetter = question => letters.find(letter => letter !== question.correta);
const orderedRound = () => new SaciQuizRound(questions, () => 1 - Number.EPSILON);

test('15 perguntas na ordem fornecida, três opções e gabarito preservado', () => {
    assert.deepEqual(questions.map(question => question.id), Array.from({ length: 15 }, (_, index) => index + 1));
    assert.equal(questions.map(question => question.correta).join(''), 'BCAACBACBBACCBA');
    for (const question of questions) {
        assert.equal(question.alternativas.length, 3);
        assert.ok(question.pergunta.length && question.alternativas.every(text => typeof text === 'string' && text.length));
        assert.ok(letters.includes(question.correta));
    }
    assert.equal(questions[5].alternativas[1], 'Avisar um adulto para buscar orientação veterinária.');
    assert.equal(questions[10].alternativas[0], 'Uma atividade adequada para ele e feita com segurança.');
    assert.equal(questions[12].alternativas[2], 'Perguntar à pessoa que cuida dele se podemos nos aproximar.');
});

test('começa na primeira pergunta, sem feedback e com zero acertos', () => {
    const round = orderedRound();
    assert.equal(round.currentQuestion.id, 1);
    assert.equal(round.hits, 0);
    assert.equal(round.phase, 'question');
    assert.equal(round.feedback, null);
    assert.equal(round.advance(), false);
    assert.throws(() => new SaciQuizRound([]));
    assert.throws(() => new SaciQuizRound(questions.slice(0, 4)));
    assert.equal(round.total, 5);
});

test('aceita uma única resposta e conta o acerto uma única vez', () => {
    const round = orderedRound();
    const result = round.answer('B');
    assert.deepEqual(result, { chosen: 'B', correct: 'B', correctText: questions[0].alternativas[1], isCorrect: true });
    assert.equal(round.hits, 1);
    for (const letter of ['B', 'A', 'C', 'B']) assert.equal(round.answer(letter), null);
    assert.equal(round.hits, 1);
    assert.equal(round.feedback, result);
    assert.equal(round.index, 0); // Feedback nunca avança automaticamente.
});

test('erro informa letra e texto corretos, sem segunda tentativa', () => {
    const round = orderedRound();
    assert.deepEqual(round.answer('A'), {
        chosen: 'A', correct: 'B', correctText: questions[0].alternativas[1], isCorrect: false
    });
    assert.equal(round.answer('B'), null);
    assert.equal(round.hits, 0);
});

test('não confunde índice, letra inválida ou tecla repetida com uma escolha', () => {
    const round = orderedRound();
    for (const invalid of [0, 1, 2, 'b', 'D', '', null, undefined]) {
        assert.equal(round.answer(invalid), null);
        assert.equal(round.phase, 'question');
        assert.equal(round.hits, 0);
    }
});

test('avanço é manual e único; limpa o feedback antes da nova questão', () => {
    const round = orderedRound();
    round.answer('B');
    assert.equal(round.advance(), true);
    assert.equal(round.advance(), false); // Segundo clique sem nova resposta.
    assert.equal(round.index, 1);
    assert.equal(round.currentQuestion.id, 2);
    assert.equal(round.phase, 'question');
    assert.equal(round.feedback, null);
    assert.equal(round.hits, 1);
});

test('percorre cinco questões distintas, aceita acertos A/B/C e só conclui ao finalizar', () => {
    const before = JSON.stringify(questions);
    const round = orderedRound();
    const visited = [];
    for (let index = 0; index < 5; index++) {
        const question = round.currentQuestion;
        visited.push(question.id);
        assert.equal(round.isLastQuestion, index === 4);
        assert.equal(round.answer(question.correta).isCorrect, true);
        assert.equal(round.hits, index + 1);
        assert.equal(round.phase, 'feedback');
        assert.equal(round.currentQuestion.id, question.id);
        round.advance();
        assert.equal(round.advance(), false);
    }
    assert.deepEqual(visited, [1, 2, 3, 4, 5]);
    assert.equal(round.phase, 'complete');
    assert.equal(round.currentQuestion, null);
    assert.equal(round.hits, 5);
    assert.equal(round.index, 4);
    assert.equal(round.answer('A'), null);
    assert.equal(round.advance(), false);
    assert.equal(JSON.stringify(questions), before);
});

test('cinco erros terminam com zero acertos', () => {
    const round = new SaciQuizRound(questions);
    for (const question of round.questions) { round.answer(wrongLetter(question)); round.advance(); }
    assert.equal(round.phase, 'complete');
    assert.equal(round.hits, 0);
});

test('resultado misto e reinício zeram índice, feedback, acertos e bloqueios', () => {
    const round = orderedRound();
    round.questions.forEach((question, index) => {
        round.answer(index % 2 === 0 ? question.correta : wrongLetter(question)); round.advance();
    });
    assert.equal(round.hits, 3);
    round.reset();
    assert.equal(round.index, 0);
    assert.equal(round.currentQuestion.id, 1);
    assert.equal(round.phase, 'question');
    assert.equal(round.feedback, null);
    assert.equal(round.hits, 0);
    assert.equal(round.answer('B').isCorrect, true);
    assert.equal(round.hits, 1);
    round.reset(); // Também limpa uma rodada parcial, sem criar listeners.
    assert.equal(round.phase, 'question');
    assert.equal(round.hits, 0);
    assert.equal(round.feedback, null);
});

test('partidas independentes não compartilham contagem', () => {
    const first = orderedRound();
    const second = new SaciQuizRound(questions);
    first.answer('B');
    assert.equal(second.hits, 0);
    assert.equal(second.phase, 'question');
});

test('Fisher–Yates seleciona cinco do banco inteiro e reinício faz um novo sorteio', () => {
    const before = JSON.stringify(questions);
    let value = 1 - Number.EPSILON;
    let draws = 0;
    const round = new SaciQuizRound(questions, () => { draws++; return value; });
    const first = round.questions;
    assert.deepEqual(first.map(q => q.id), [1, 2, 3, 4, 5]);
    assert.equal(draws, 14);
    round.answer(first[0].correta);
    value = 0;
    round.reset();
    assert.equal(draws, 28, 'Reinício executa outro embaralhamento completo');
    assert.notEqual(round.questions, first);
    assert.deepEqual(round.questions.map(q => q.id), [2, 3, 4, 5, 6]);
    assert.equal(round.index, 0);
    assert.equal(round.hits, 0);
    assert.equal(round.feedback, null);
    assert.equal(round.phase, 'question');
    assert.equal(JSON.stringify(questions), before);
});

test('sorteios preservam banco, alternativas e gabarito; todas as 15 podem participar', () => {
    const frozen = Object.freeze(questions.map(q => Object.freeze({ ...q, alternativas: Object.freeze([...q.alternativas]) })));
    let seed = 123;
    const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
    const round = new SaciQuizRound(frozen, random);
    const visited = new Set();
    for (let game = 0; game < 30; game++) {
        assert.equal(round.total, 5);
        assert.equal(new Set(round.questions.map(q => q.id)).size, 5);
        for (const question of round.questions) {
            visited.add(question.id);
            assert.equal(question, frozen.find(q => q.id === question.id));
            const result = round.answer(wrongLetter(question));
            assert.equal(result.correct, question.correta);
            assert.equal(result.correctText, question.alternativas[letters.indexOf(question.correta)]);
            round.advance();
        }
        assert.equal(round.phase, 'complete');
        round.reset();
    }
    assert.deepEqual([...visited].sort((a, b) => a - b), questions.map(q => q.id));
});
