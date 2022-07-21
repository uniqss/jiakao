import { _decorator, Component, Node, Label, random, math } from 'cc';
const { ccclass, property } = _decorator;

class ProblemAnswer {
    public problem: string;
    public answer: string;

    constructor(p: string, a: string) {
        this.problem = p;
        this.answer = a;
    }
};

enum GAME_STATE {
    PROBLEM = 1,
    ANSWER = 2,
}

const PROBLEM_TIME = 4;
const ANSWER_TIME = 2;

@ccclass('jiakao3')
export class jiakao3 extends Component {

    @property(Label)
    lbl_problem: Label = null;

    @property(Label)
    lbl_answer: Label = null;

    delta: number = 0;
    lastUpdate: number = 0;
    pos: number = -1;

    state: GAME_STATE = GAME_STATE.PROBLEM;

    problemsAnswers = new Array<ProblemAnswer>;
    randPos = new Array<number>;

    start() {
        this.delta = 0;
        this.lastUpdate = 0;
        this.problemsAnswers.push(new ProblemAnswer("同方向近距离跟车行驶", "近光灯"));
        this.problemsAnswers.push(new ProblemAnswer("通过有信号灯控制的路口", "近光灯"));
        this.problemsAnswers.push(new ProblemAnswer("在有路灯，照明良好的道路上行驶", "近光灯"));

        this.problemsAnswers.push(new ProblemAnswer("通过急弯", "交替远近光灯两次"));
        this.problemsAnswers.push(new ProblemAnswer("通过坡道", "交替远近光灯两次"));
        this.problemsAnswers.push(new ProblemAnswer("通过拱桥", "交替远近光灯两次"));
        this.problemsAnswers.push(new ProblemAnswer("通过人行横道", "交替远近光灯两次"));
        this.problemsAnswers.push(new ProblemAnswer("通过没有交通信号灯控制的路口", "交替远近光灯两次"));

        this.problemsAnswers.push(new ProblemAnswer("超车", "左转向灯-回-交替远近光灯两次-右转向灯-回"));

        this.problemsAnswers.push(new ProblemAnswer("进入无照明的道路行驶", "远光灯"));
        this.problemsAnswers.push(new ProblemAnswer("夜间在照明不良的道路上行驶", "远光灯"));

        this.problemsAnswers.push(new ProblemAnswer("路边临时停车", "示阔灯+危险报警闪光灯"));

        for (let i = 0; i < this.problemsAnswers.length; i++) {
            this.randPos.push(i);
        }

        /*
    tips.push_back({"同方向近距离跟车行驶", "近光灯"});
    tips.push_back({"通过有信号灯控制的路口", "近光灯"});
    tips.push_back({"在有路灯，照明良好的道路上行驶", "近光灯"});

    tips.push_back({"通过急弯", "交替远近光灯两次"});
    tips.push_back({"通过坡道", "交替远近光灯两次"});
    tips.push_back({"通过拱桥", "交替远近光灯两次"});
    tips.push_back({"通过人行横道", "交替远近光灯两次"});
    tips.push_back({"通过没有交通信号灯控制的路口", "交替远近光灯两次"});

    tips.push_back({"超车", "左转向灯-回-交替远近光灯两次-右转向灯-回"});

    tips.push_back({"进入无照明的道路行驶", "远光灯"});
    tips.push_back({"夜间在照明不良的道路上行驶", "远光灯"});

    tips.push_back({"路边临时停车", "示阔灯+危险报警闪光灯"});
        */
    }

    update(deltaTime: number) {
        this.delta += deltaTime;
        var diff: number = this.delta - this.lastUpdate;
        const updateDiff = 1;
        // console.log("update deltaTime:" + deltaTime + " delta:" + this.delta + " lastUpdate:" + this.lastUpdate + " diff:" + diff);
        if (diff > updateDiff) {
            this.doUpdate1s();
            this.lastUpdate += updateDiff;
        }
    }

    updateProblem(pos: number) {
        console.log("pos:" + pos);
        this.lbl_problem.string = this.problemsAnswers[pos].problem;
        this.lbl_answer.string = "";
    }

    updateAnswer(pos: number) {
        console.log("pos:" + pos);
        this.lbl_answer.string = this.problemsAnswers[pos].answer;
    }

    reRand() {
        console.log("reRand pos:" + this.pos);
        this.pos = 0;
        for (let i = 0; i < this.randPos.length; i++) {
            let rd = Math.floor(Math.random() * this.randPos.length);
            let tmp = this.randPos[i];
            this.randPos[i] = this.randPos[rd];
            this.randPos[rd] = tmp;
        }
    }

    doUpdate1s() {
        console.log("doUpdate1s this.lastUpdate:" + this.lastUpdate + " length:" + this.problemsAnswers.length);

        if (this.pos < 0 || this.pos >= this.problemsAnswers.length) {
            this.reRand();
        }

        if (this.lastUpdate % (PROBLEM_TIME + ANSWER_TIME) === 0) {
            this.updateProblem(this.randPos[this.pos]);
            return;
        }
        if (this.lastUpdate % (PROBLEM_TIME + ANSWER_TIME) === PROBLEM_TIME) {
            this.updateAnswer(this.randPos[this.pos]);
            this.pos++;
            return;
        }
    }
}

