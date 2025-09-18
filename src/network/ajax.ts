const ENUM_REQUEST_METHODS: any = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};

type Request = (config: any) => any;
type Response = (response: any) => any;
type RequestSuccess = (response: any) => any;
type RequestError = (error: Error) => void;

export default (config: any, req?: Request, res?: Response): any => {

    const request: any = {};

    const requestResult = (api: string, method: string, config: any = {}, success: RequestSuccess, error: RequestError) => {
        return new Promise((resolve, reject) => {
            if (typeof req === 'function') {
                config = req(config);
            }

            let { params, headers, dataType = 'json' } = config;

            const options: any = {
                url: api,
                type: method,
                dataType,
                contentType: 'application/json',
                success: function (result: any) {
                    let d = result;

                    if (typeof res === 'function') {
                        d = res(result);
                    }

                    typeof success === 'function' && success(d);

                    resolve(d);
                },
                error: function (e: any) {

                    typeof error === 'function' && error(e);

                    reject(e);
                }
            };
            if (params) {
                options[ 'data' ] = JSON.stringify(params);
            }
            if (headers) {
                options[ 'headers' ] = headers;
            }
            (window as any)[ 'jQuery' ].ajax(options);
        });
    };

    Object.keys(ENUM_REQUEST_METHODS).map((key: string) => {
        const method = ENUM_REQUEST_METHODS[ key ];

        request[ method.toLocaleLowerCase() ] = function (api: string = '', config: any = {}, success: RequestSuccess, error: RequestError) {
            return requestResult(api, method, config, success, error);
        };
    });

    return request;
};
