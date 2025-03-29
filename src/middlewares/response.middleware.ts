import { Response } from "express";

export type TResponse= {
    status_code: number,
    message: string,
    data?: any | undefined,
    label?: any | undefined
};

export default function respond(response: TResponse, res: Response){
    const _response: any = {
        status: true,
        message: response.message,
    };

    if (response.data !== undefined) {
        _response[response.label || "data"] = response.data;
    }
    res.status(response.status_code).json(_response);
}