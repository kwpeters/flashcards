import {ISerializable, ISerializationAide, ISerialized} from "./serialization";

export class QuestionMultChoiceSerializationAide implements ISerializationAide
{
    constructor() {
    }

    public get serializationId(): string {
        return "QuenstionMultChoice";
    }

    public deserialize(serialized: ISerialized): QuestionMultChoice | undefined
    {
        if (serialized.serialization.id !== this.serializationId) {
            return undefined;
        }

        switch (serialized.serialization.schema) {
            case 1:
                return new QuestionMultChoice(serialized.question,
                                              serialized.answer,
                                              serialized.wrongAnswers);
            default:
                return undefined;
        }
    }
}


export class QuestionMultChoice implements ISerializable
{
    public static serializationAide: QuestionMultChoiceSerializationAide = new QuestionMultChoiceSerializationAide();

    private _question: string;
    private _answer: string;
    private _wrongAnswers: Array<string>;


    public constructor(question: string, answer: string, wrongAnswers: Array<string>) {
        this._question = question;
        this._answer = answer;
        this._wrongAnswers = wrongAnswers;
    }


    public get question(): string {
        return this._question;
    }


    public get answer(): string {
        return this._answer;
    }


    public get wrongAnswers(): Array<string> {
        return this._wrongAnswers;
    }


    public serialize(): ISerialized
    {
        return {
            serialization: {
                id: QuestionMultChoice.serializationAide.serializationId,
                schema: 1
            },
            question:     this._question,
            answer:       this._answer,
            wrongAnswers: this._wrongAnswers
        };
    }

}
