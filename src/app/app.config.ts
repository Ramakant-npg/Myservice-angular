export const ConnectionTypeConfig = {
    connection_type : "connectionsg99",
}

// export const allConnectionTypes = ['connectionsg98','connectionsg98multiple','connectionsg99','connectionsfuseupgrd'];

export const allConnectionTypes = [
    {
        name: 'connectionsg98',
        description: 'Connecting Micro-generation at a single premises (up to 16 Amp per phase) - G98'
    },
    {
        name:'connectionsg98multiple',
        description: 'Connecting Micro-generation at multiple premises (up to 16 Amp per phase) - G98'
    },
    {
        name:'connectionsg99',
        description: 'Connecting large scale generation (above 16 AMP per phase) and Energy Storage Systems - G99'
    },
    {
        name:'connectionsfuseupgrd',
        description: 'Connection fuse upgrade'
    }];


// user can accept number and alphabet not special  (project12)
// user can accept alphabet and . ( ex mr.)
// user can accept alphabet ex: first name
// need to set minimu number for telephone (min 10 to 11)