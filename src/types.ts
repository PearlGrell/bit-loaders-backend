import { CorsOptions } from "cors";

export type Settings = {
      appname: string;
      environment: string;
      api_prefix: string;
      server: {
            port: number;
            apiPrefix: string;
      };
      cors: CorsOptions,
      auth: {
            JWT_SECRET: string;
      };
      mail: {
            host: string;
            port: number;
            auth: {
                  user: string;
                  pass: string;
            };
      };
};