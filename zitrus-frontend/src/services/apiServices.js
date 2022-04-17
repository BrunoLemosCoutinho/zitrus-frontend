const formatCep = cep => {
    return cep.replace(/-|\./g, "");
}


async function fetchCEP(cep) {
    const formattedCep = formatCep(cep);
    const requestResponse = await fetch(`https://opencep.com/v1/${formattedCep}`);
    const data = await requestResponse.json();
    return data;
}

export default fetchCEP;
