export class QuestionText
{
    private _question: string;
    private _answer: string;

    constructor(question: string, answer: string)
    {
        this._question = question;
        this._answer = answer;
    }


    public get question(): string
    {
        return this._question;
    }


    public get answer(): string
    {
        return this._answer;
    }

}
