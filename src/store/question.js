import axios from "axios"
import { shuffle } from "../helper/array"
import { ALTERNATIVES_LETTERS } from "../helper/const"

const state = {
    questions: [],
    currentQuestionIndex: 0
}

const getters = {
    currentQuestion(state) {
        return state.questions[state.currentQuestionIndex];
    },
    currentQuestionIndex(state) {
        return state.currentQuestionIndex;
    }
    
}

const mutations = {
    loadQuestions: (state, payload) => {
        state.questions = payload;
    },
    incrementQuestionIndex: (state) => {
        state.currentQuestionIndex++;
    }
}

const actions = {
    loadQuestions:  async ({commit}) => {
        try {
            const response = await axios.get('/', { params: { amount: 15, type:'multiple' }});
            const questions = response.data.results;
            for (let question of questions) {
                question.alternatives = [];
                question.alternatives = question.incorrect_answers.map(ia => {
                    return {text:ia, is_correct:false};
                })
                question.alternatives.push({ text: question.correct_answer, is_correct : true});
                question.alternatives = shuffle(question.alternatives);
                question.alternatives = question.alternatives.map((qa, index) => {
                    qa.letter = ALTERNATIVES_LETTERS[index];
                    return qa;
                })
            }
            console.log(questions);
            commit('loadQuestions', questions);
        } catch(error) {
            console.log(error);
        }
    },
    incrementQuestionIndex: ({commit}) => {
        commit('incrementQuestionIndex');
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}