import {
    ISerializable, ISerializationAide,
    ISerialized
} from "./serialization";

export class QuestionTextSerializationAide implements ISerializationAide
{
    constructor() {}

    public get serializationId(): string
    {
        return "QuestionText";
    }


    public deserialize(serialized: ISerialized): QuestionText | undefined
    {
        if (serialized.serialization.id !== this.serializationId) {
            return undefined;
        }

        switch (serialized.serialization.schema) {
            case 1:
                return new QuestionText(serialized.question, serialized.answer);

            default:
                return undefined;
        }
    }
}


export class QuestionText implements ISerializable
{
    public static serializationAide: QuestionTextSerializationAide = new QuestionTextSerializationAide();

    private _question: string;
    private _answer: string;

    constructor(question: string, answer: string) {
        this._question = question;
        this._answer = answer;
    }

    public get question(): string {
        return this._question;
    }

    public get answer(): string {
        return this._answer;
    }

    public serialize(): ISerialized {
        return {
            serialization: {
                id:     QuestionText.serializationAide.serializationId,
                schema: 1
            },
            question:   this._question,
            answer:     this._answer
        };
    }

}
