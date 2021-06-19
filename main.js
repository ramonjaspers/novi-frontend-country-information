async function getCountryInfo() {
    const value = document.getElementById('search').value;
    document.getElementById('button').disabled = true;
    const countryData = await fetchCountryData(value);
    document.querySelector('button').disabled = false;

    if (countryData) {
        prepareCountryHTML();
        populateCountryHTML(countryData);
    } else {
        generateError();
    }
}

async function fetchCountryData(country) {
    let response = {};
    try {
        const url = `https://restcountries.eu/rest/v2/name/${country}`;
        response = await axios.get(url);
    } catch {
        return;
    }

    return response.data[0];
}

/**
 * Clears all country data
 */
function prepareCountryHTML() {
    const wrapper = document.getElementById('countryWrapper')
    wrapper.style.opacity = 0;
    document.getElementById('countryData').innerHTML = "";
    setTimeout(() => {
        wrapper.style.opacity = 1;
    }, 1000);
}

/**
 * 
 * @param object data 
 */
function populateCountryHTML(data) {
    //get data
    const currency = getCurrencyText(data.currencies);
    const language = getLanguageText(data.languages);
    //get base nodes
    const country = document.getElementById('countryData');
    const imageWrapper = document.createElement('div');
    imageWrapper.setAttribute('id', 'imageWrapper');
    country.appendChild(imageWrapper);

    const countryFlag = document.createElement('IMG');
    countryFlag.setAttribute('src', data.flag);
    countryFlag.setAttribute('width', '100px');
    imageWrapper.appendChild(countryFlag);

    const countryName = document.createElement('h1')
    countryName.textContent = data.name;
    imageWrapper.appendChild(countryName);

    const displayCountryInfo = document.createElement('p')
    displayCountryInfo.textContent = `The capital is ${data.capital} ${currency}`;
    country.appendChild(displayCountryInfo);


    const countryInfo = document.createElement('p')
    countryInfo.textContent = `${data.name} is situated in ${data.subregion}. It has a population of ${data.population} people`;
    country.appendChild(countryInfo)

    const countryLanguage = document.createElement('p')
    countryLanguage.textContent = language;
    country.appendChild(countryLanguage)

    const countryWiki = document.createElement('a')
    countryWiki.textContent = `More info about ${data.name} on Wikipedia`
    countryWiki.href = `https://en.wikipedia.org/wiki/${data.name}`
    countryWiki.target = '_blank'
    country.appendChild(countryWiki)
}


function getCurrencyText(currencies) {
    //we generate the base string
    let currencyString = 'You can pay with ';
    for (let i = 0; i < currencies.length; i++) {
        if (i > 0) {
            //if we already had the first value of the array we add 'and'
            currencyString += ' and '
        }
        //we add the currency to the string
        currencyString += `${currencies[i].name}'s`
    }
    //we finish by adding a dot to the end and return the value
    currencyString += '.';

    return currencyString;
}

function getLanguageText(languages) {
    let languageString = 'They speak ';
    for (let i = 0; i < languages.length; i++) {
        if (i > 0) {
            languageString += ' and '
        }
        languageString += languages[i].name;
    }
    languageString += '.';

    return languageString;
}

function generateError() {
    const errElement = document.getElementById('err')
    errElement.innerHTML = 'The given country does not exist in our data, check your input and try again!';
    errElement.style.opacity = 1;
    setTimeout(() => {
        errElement.style.opacity = 0;
    }, 3000);
}