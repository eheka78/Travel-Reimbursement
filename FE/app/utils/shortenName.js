export const shortenName = (name, max = 3) => {
    if (!name) return "";
    return name.length > max ? `${name.slice(0, max)}…` : name;
};
