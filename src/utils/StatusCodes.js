export const STATUS_CODES = {
    client: {
        bad_request: 400,
        unauthorized: 401,
        payment_required: 402,
        not_found: 404,
    },
    server: {
        internal_server_error: 500,
        gateway_time_out:504
    },
    success:{
        ok:200,
        created:201,
        accepted:202
    }
}