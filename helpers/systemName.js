function parseSystemName(args) {
    const argsLength = args.length;
    let systemName = "",
        systemNameWeb = "";

    for (let i = 0; i < argsLength; i++)
        systemName += args[i].toLowerCase() + " ";

    systemName.trim();
    systemNameWeb = encodeURIComponent(systemName);

    return { systemName, systemNameWeb };
}

module.exports = { parseSystemName };
