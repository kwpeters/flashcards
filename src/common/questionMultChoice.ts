export class QuestionMultChoice
{
    private _question: string;
    private _answer: string;
    private _wrongAnswers: Array<string>;


    public constructor(question: string, answer: string, wrongAnswers: Array<string>)
    {
        this._question = question;
        this._answer = answer;
        this._wrongAnswers = wrongAnswers;
    }


    public get questions(): string
    {
        return this._question;
    }


    public get answer(): string
    {
        return this._answer;
    }


    public get wrongAnswers(): Array<string>
    {
        return this._wrongAnswers;
    }

}
