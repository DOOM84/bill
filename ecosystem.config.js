module.exports = {
    apps: [
        {
            name: 'bill',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
                NODE_PORT:"3060",
                //NODE_ENV:"development"
            }
        }
    ]
}